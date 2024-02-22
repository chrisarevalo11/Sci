import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/getContracts'
import { toDecimal, toNumber } from '@/utils'
export default function FaucetCard(): JSX.Element {
	const { address } = useAccount()
	const { daiMockContract, alloContract } = getContracts()

	const navigate = useNavigate()

	const [allowance, setAllowance] = useState<number>(0)
	const [balance, setBalance] = useState<number>(0)
	const [loading, setLoading] = useState<boolean>(true)
	const [syncronized, setSyncronized] = useState<boolean>(false)

	const getStates = async () => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

			setSyncronized(true)
			setLoading(false)
		} catch (error) {
			alert('Error: Look at console')
			console.error(error)
			setLoading(false)
		}
	}

	const onMint = async () => {
		try {
			setLoading(true)

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
				await getStates()
			})()
		} else {
			navigate('/app/projects')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, syncronized])

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] max-w-[500px] p-3 text-center'>
			<h4>Get tokens</h4>
			<p>
				This is a test DAI faucet that will allow you to interact with Sci. By
				clicking the &quot;GET&quot; button below you will receive 10,000 DAI.
			</p>
			{loading ? (
				'Loading...'
			) : (
				<div className='flex gap-4 items-center'>
					<p>
						<span className='font-dela mr-2'>Balance:</span>
						{balance}
					</p>
					<p>
						<span className='font-dela mr-2'>Allowance: </span>
						{allowance}
					</p>
				</div>
			)}
			<button
				className='btn btn-green mt-3'
				onClick={onMint}
				disabled={loading}
			>
				Get
			</button>
		</div>
	)
}
