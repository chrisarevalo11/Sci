import { useState } from 'react'
import { ethers } from 'ethers'

import { getContracts } from '@/helpers/getContracts'
import { formatAddress, toDecimal } from '@/utils'

export default function Approve(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false)
	const { daiMockContract, alloContract } = getContracts()

	const onApprove = async () => {
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

			const approveTx = await daiMockContract
				.connect(web3Signer)
				.approve(alloContract.target, toDecimal(1000))
			await approveTx.wait()
			setLoading(false)
		} catch (error) {
			console.error(error)
			alert('Error: Look at console')
			setLoading(false)
		}
	}

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] max-w-[500px] p-3 text-center'>
			<h4>Approve tokens</h4>
			<p>
				By clicking the button below you will approve the Allo contract (address
				above & below) to move test DAI (the amount you specify) from your
				wallet.
			</p>
			<input
				type='text'
				className='text-center opacity-60'
				value={formatAddress(alloContract.target)}
				disabled
				readOnly
			/>
			<button onClick={onApprove} className='btn btn-green mt-3'>
				{loading ? 'Loading...' : 'Approve'}
			</button>
		</div>
	)
}
