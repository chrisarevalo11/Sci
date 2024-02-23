import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Approve from '@/components/faucet/Approve'
import FaucetCard from '@/components/faucet/FaucetCard'
import Clipboard from '@/components/ui/Clipboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getContracts } from '@/helpers/contracts'
import { formatAddress } from '@/utils'

export default function Faucet(): JSX.Element {
	const { address } = useAccount()
	const { alloContract } = getContracts()

	const navigate = useNavigate()

	useEffect(() => {
		if (!address) {
			navigate('/app/projects')
		}
		// eslint-disable-next-line
	}, [address])

	return (
		<section className='w-full h-full p-4 md:p-10 relative md:overflow-hidden'>
			<header className='flex flex-col-reverse md:flex-row justify-end md:justify-between items-end pb-3 border-b-4 md:items-center border-customBlack border-dashed'>
				<div className='font-bold text-lg flex items-center'>
					<span className='font-dela mr-2'>Allo address:</span>
					<Clipboard text={alloContract.target}>
						{formatAddress(alloContract.target)}
					</Clipboard>
				</div>
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
