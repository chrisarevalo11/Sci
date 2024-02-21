import { useEffect, useState } from 'react'
import { BytesLike, ethers, ZeroAddress } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/getContracts'
import { registerRecipient, reviewRecipients } from '@/helpers/relay'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { RecipientData } from '@/models/recipient-data.model'
import { Round } from '@/models/round.model'
import { toAbiCoder } from '@/utils'
import { RECIPIENT_DATA_STRUCT_TYPES } from '@/utils/variables/constants'
import { Status } from '@/utils/variables/enums'

export default function CreateProject(): JSX.Element {
	const { address } = useAccount()
	const { getLastRound, updateRound } = roundsApiFirebase()

	const { daiMockContract, alloContract } = getContracts()

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

			const banner: string = ''
			const description: string =
				'Interpolation of field information with satellite information'
			const github: string = 'www.github.com/recipients'
			const logo: string = ''
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

			const registerRecipientResponse: string = await registerRecipient(
				round?.poolId,
				recipientData
			)

			const reviewRecipientsResponse: string = await reviewRecipients(
				[address],
				[Status.InReview]
			)

			console.log('responseTransaction', registerRecipientResponse)
			console.log('responseReview', reviewRecipientsResponse)

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

			round.projects?.push(project)
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
