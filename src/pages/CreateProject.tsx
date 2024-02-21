import { useEffect, useState } from 'react'
import { BytesLike, ethers, ZeroAddress } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/getContracts'
import { RecipientData } from '@/models/recipient-data.model'
import { toAbiCoder, toDecimal, toNumber } from '@/utils/functions'
import { RECIPIENT_DATA_STRUCT_TYPES } from '@/utils/variables/constants'

export default function CreateProject(): JSX.Element {
	const { address } = useAccount()
	const { daiMockContract, alloContract } = getContracts()

	const navigate = useNavigate()

	const [allowance, setAllowance] = useState<number>(0)
	const [balance, setBalance] = useState<number>(0)
	const [loading, setLoading] = useState<boolean>(true)
	const [sciAddress, setSciAddress] = useState<string>('')
	const [syncronized, setSyncronized] = useState<boolean>(false)

	const getStates = async () => {
		try {
			const ethereum = (window as any).ethereum

			if (!ethereum) {
				alert('Ethereum object not found')
				return
			}

			const web3Provider: ethers.BrowserProvider = new ethers.BrowserProvider(
				ethereum
			)

			const allowance: number = toNumber(
				await daiMockContract
					.connect(web3Provider)
					.allowance(address, alloContract.target)
			)
			setAllowance(allowance)

			const balanceOf: number = toNumber(
				await daiMockContract.connect(web3Provider).balanceOf(address)
			)
			setBalance(balanceOf)
			setSciAddress(alloContract.target)

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

			setSyncronized(false)
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
					<h4>Sci Address: {sciAddress}</h4>
					<br />
					<button onClick={onRegisterRecipient}>registerRecipient</button>
				</div>
			)}
		</div>
	)
}
