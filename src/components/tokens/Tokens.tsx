import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatAddress } from '@/utils'

import Approve from './Approve'
import Faucet from './Faucet'

export default function Tokens(): JSX.Element {
	return (
		<section className='w-full p-2 md:p-10 relative'>
			<header className='flex justify-between pb-3 border-b-4 items-center border-customBlack border-dashed'>
				<p className='font-bold text-lg'>
					<span className='font-dela mr-2'>Allo address:</span>
					{formatAddress('0x9d0757C6cF366De37aB87128DD82e865F64f766C')}
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
						<Faucet />{' '}
					</TabsContent>
					<TabsContent value='approve'>
						<Approve />
					</TabsContent>
				</Tabs>
			</div>
			<img
				src='/images/slime-no-bg.webp'
				alt='slime'
				className='absolute rotate-45 -z-10 right-[-20px] bottom-[-200px]'
			/>
		</section>
	)
}
