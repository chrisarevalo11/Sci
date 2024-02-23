import { useEffect, useState } from 'react'
import { BytesLike, ethers, ZeroAddress } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/contracts'
import { registerRecipient, reviewRecipients } from '@/helpers/relay'
import { profilesApiFirebase } from '@/middlewares/firebase/profile.firebase.middleware'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { RecipientData } from '@/models/recipient-data.model'
import { Round } from '@/models/round.model'
import { toAbiCoder } from '@/utils'
import {
	GAS_LIMIT,
	RECIPIENT_DATA_STRUCT_TYPES
} from '@/utils/variables/constants'
import { Status } from '@/utils/variables/enums'

export default function CreateProject(): JSX.Element {
	const { address } = useAccount()
	const { getLastRound, updateRound } = roundsApiFirebase()
	const { getProfileByAddress } = profilesApiFirebase()

	const { alloContract } = getContracts()

	const navigate = useNavigate()

	const [loading, setLoading] = useState<boolean>(true)
	const [round, setRound] = useState<Round | null>(null)
	const [syncronized, setSyncronized] = useState<boolean>(false)

	const getStates = async () => {
		try {
			const lastRound: Round = await getLastRound()
			setRound(lastRound)

			setSyncronized(true)
			setLoading(false)
		} catch (error) {
			alert('Error: Look at console')
			console.error(error)
			setLoading(false)
		}
	}

	const onRegisterRecipient = async () => {
		try {
			setLoading(true)
			const ethereum = (window as any).ethereum

			if (!ethereum) {
				alert('Ethereum object not found')
				return
			}

			const web3Provider: ethers.BrowserProvider = new ethers.BrowserProvider(
				ethereum
			)
			await web3Provider.send('eth_requestAccounts', [])
			const web3Signer: ethers.JsonRpcSigner = await web3Provider.getSigner()

			const banner: string =
				'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2Fk6HOlMRHUM3ru78xLEFnmUyIwr4%3D%2F0x0%3A800x533%2F1200x800%2Ffilters%3Afocal(0x0%3A800x533)%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_image%2Fimage%2F30291399%2F800px-thoreaus_quote_near_his_cabin_site__walden_pond.0.jpg&f=1&nofb=1&ipt=8409d0f745c896681625cd32b0f36396463f6cc2b81643dbae6e639ba24b1b2f&ipo=images'
			const description: string =
				'Interpolation of field information with satellite information'
			const github: string = 'www.github.com/recipients'
			const logo: string =
				'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fep01.epimg.net%2Fcultura%2Fimagenes%2F2016%2F09%2F09%2Fbabelia%2F1473420066_993651_1473430939_noticia_normal.jpg&f=1&nofb=1&ipt=65fb6ff7f54bb2df9ed64412dac43ca6f3c9a1921e591cc4eb66e84165793eac&ipo=images'
			const name: string = 'Recipients'
			const slogan: string = 'Gaia is our home'
			const tags: string[] = ['satellite', 'field']
			const twitter: string = 'www.twitter.com/recipients'
			const website: string = 'www.recipients.com'

			if (!address) return

			const recipientDataObject: RecipientData = {
				recipientId: address,
				recipientAddress: ZeroAddress,
				metadata: {
					protocol: BigInt(1),
					pointer: 'ipfs://QmQmQmQmQmQmQmQmQmQmQmQmQm'
				}
			}

			const recipientDataArray: any[] = [
				recipientDataObject.recipientId,
				recipientDataObject.recipientAddress,
				[
					recipientDataObject.metadata.protocol,
					recipientDataObject.metadata.pointer
				]
			]

			const recipientData: BytesLike = toAbiCoder(
				RECIPIENT_DATA_STRUCT_TYPES,
				recipientDataArray
			)

			if (!round) return
			if (!address) return

			const registerRecipientTx = await alloContract
				.connect(web3Signer)
				.registerRecipient(round.poolId, recipientData, { gasLimit: GAS_LIMIT })

			await registerRecipientTx.wait()

			const reviewRecipientsResponse: string = await reviewRecipients(
				round.address,
				[address],
				[Status.InReview]
			)

			console.log('reviewRecipientsResponse: ', reviewRecipientsResponse)

			const project: Project = {
				banner,
				description,
				github,
				logo,
				name,
				recipientId: address,
				slogan,
				tags,
				twitter,
				website
			}

			if (!round.projects) {
				round.projects = []
			}

			round.projects.push(project)
			console.log('round', round)
			await updateRound(round)

			setLoading(false)
		} catch (error) {
			console.error(error)
			alert('Error: Look at console')
			setLoading(false)
		}
	}

	useEffect(() => {
		if (address) {
			;(async () => {
				await getStates()
			})()
		} else {
			navigate('/app/projects')
		}
	}, [address, syncronized])

	return (
		<div>
			<h1>Create Project</h1>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					<button onClick={onRegisterRecipient}>registerRecipient</button>
				</div>
			)}
		</div>
	)
}
