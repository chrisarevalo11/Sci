import { ethers } from 'ethers'

import { ERC20Details } from '@/models/ERC20Details.model'
import { toDecimal } from '@/utils'

type Props = {
	erc20Details: ERC20Details
	erc20DetailsFetched: boolean
}

export default function MintCard(props: Props): JSX.Element {
	const { erc20Details, erc20DetailsFetched } = props

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

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] max-w-[500px] p-3 text-center'>
			<h4>Get tokens</h4>
			<p>
				This is a test DAI faucet that will allow you to interact with Sci. By
				clicking the GET button below you will receive 10,000 DAI.
			</p>
			{!erc20DetailsFetched ? (
				'Loading...'
			) : (
				<div className='flex gap-4 items-center'>
					<p>
						<span className='font-dela mr-2'>Balance:</span>
						{erc20Details.balance}
					</p>
					<p>
						<span className='font-dela mr-2'>Allowance: </span>
						{erc20Details.allowance}
					</p>
				</div>
			)}
			<button
				className='btn btn-green mt-3'
				onClick={onMint}
				disabled={!erc20DetailsFetched}
			>
				Get
			</button>
		</div>
	)
}
