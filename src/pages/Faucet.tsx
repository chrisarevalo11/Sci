import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Approve from '@/components/faucet/Approve'
import MintCard from '@/components/faucet/MintCard'
import Clipboard from '@/components/ui/Clipboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ERC20Details } from '@/models/ERC20Details.model'
import { AppDispatch, useAppSelector } from '@/store'
import { getERC20Details } from '@/store/thunks/erc20details.thunk'
import { formatAddress } from '@/utils'
import {
	ALLO_CONTRACT_ADDRESS,
	BSC_SCAN_URL
} from '@/utils/variables/constants'

export default function Faucet(): JSX.Element {
	const { address } = useAccount()

	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	const erc20Details: ERC20Details = useAppSelector(
		state => state.erc20Details.erc20Details
	)

	const erc20DetailsFetched: boolean = useAppSelector(
		state => state.erc20Details.erc20DetailsFetched
	)

	useEffect(() => {
		if (!address) {
			navigate('/app/projects')
		}

		if (!erc20DetailsFetched) {
			dispatch(getERC20Details(address as string))
		}
	}, [address, navigate])

	return (
		<section className='w-full h-full p-4 md:p-10 relative md:overflow-hidden'>
			<header className='flex flex-col-reverse md:flex-row justify-end md:justify-between items-end pb-3 border-b-4 md:items-center border-customBlack border-dashed'>
				<div className='font-bold text-lg flex items-center'>
					<span className='font-dela mr-2'>Allo address:</span>
					<Clipboard text={ALLO_CONTRACT_ADDRESS}>
						<a
							className='hover:border-b-2'
							href={`${BSC_SCAN_URL}/address/${ALLO_CONTRACT_ADDRESS}`}
						>
							{formatAddress(ALLO_CONTRACT_ADDRESS)}
						</a>
					</Clipboard>
				</div>
				<h2>Faucet</h2>
			</header>
			<div className='mt-10 flex flex-col justify-center items-center'>
				<Tabs defaultValue='mint' className='min-w-[300px]'>
					<TabsList className='flex justify-center w-fit mx-auto mb-5'>
						<TabsTrigger value='mint'>Mint</TabsTrigger>
						<TabsTrigger value='approve'>Approve</TabsTrigger>
					</TabsList>
					<TabsContent value='mint'>
						<MintCard
							erc20Details={erc20Details}
							erc20DetailsFetched={erc20DetailsFetched}
						/>
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
