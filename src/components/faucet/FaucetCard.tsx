import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { getContracts } from '@/helpers/getContracts'
import { toDecimal, toNumber } from '@/utils'
export default function FaucetCard(): JSX.Element {
	const [amount, setAmount] = useState(0)
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
				{loading ? (
					'Loading...'
				) : (
					<>
						<span>Balance: {balance}</span>
						<span>Allowance: {allowance}</span>
						<span>Sci Address: {sciAddress}</span>
					</>
				)}
			</p>
			<input
				type='number'
				placeholder='Enter the amount'
				onChange={e => setAmount(parseFloat(e.target.value))}
			/>
			<button
				disabled={amount <= 0 || isNaN(amount)}
				className='btn btn-green mt-3'
				onClick={() => console.log(amount)}
			>
				Get
			</button>
		</div>
	)
}
