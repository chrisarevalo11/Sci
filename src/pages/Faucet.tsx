import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Approve from '@/components/faucet/Approve'
import FaucetCard from '@/components/faucet/FaucetCard'
import Clipboard from '@/components/ui/Clipboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getContracts } from '@/helpers/getContracts'
import { getRpcProvider } from '@/helpers/relay'
import { formatAddress, toDecimal, toNumber } from '@/utils'

export default function Faucet(): JSX.Element {
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

	const onApprove = async () => {
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

			const approveTx = await daiMockContract
				.connect(web3Signer)
				.approve(alloContract.target, toDecimal(1000))
			await approveTx.wait()

			setSyncronized(false)
		} catch (error) {
			console.error(error)
			alert('Error: Look at console')
			setLoading(false)
		}
	}

	const onMint = async () => {
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

			const mintTx = await daiMockContract
				.connect(web3Signer)
				.mint(toDecimal(10000))
			await mintTx.wait()

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
				getRpcProvider()
				await getStates()
			})()
		} else {
			navigate('/app/projects')
		}
	}, [address, syncronized])

	return (
		<section className='w-full h-full p-4 md:p-10 relative md:overflow-hidden'>
			<header className='flex justify-end md:justify-between pb-3 border-b-4 items-center border-customBlack border-dashed'>
				<p className='hidden font-bold text-lg md:flex items-center'>
					<span className='font-dela mr-2'>Allo address:</span>
					<Clipboard text={'0x9d0757C6cF366De37aB87128DD82e865F64f766C'}>
						{formatAddress('0x9d0757C6cF366De37aB87128DD82e865F64f766C')}
					</Clipboard>
				</p>
				<h2>Tokens</h2>
			</header>
			<div className='mt-10 flex flex-col justify-center items-center'>
				<Tabs defaultValue='faucet' className='min-w-[300px]'>
					<TabsList className='flex justify-center w-fit mx-auto mb-5'>
						<TabsTrigger value='faucet'>Faucet</TabsTrigger>
						<TabsTrigger value='approve'>Approve</TabsTrigger>
					</TabsList>
					<TabsContent value='faucet'>
						<FaucetCard />{' '}
					</TabsContent>
					<TabsContent value='approve'>
						<Approve />
					</TabsContent>
				</Tabs>
			</div>
			<img
				src='/images/slime-no-bg.webp'
				alt='slime'
				className='absolute rotate-45 -z-10 right-[-20px] top-[100px] '
			/>
		</section>
	)
}
