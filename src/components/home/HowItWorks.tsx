import { Link } from 'react-router-dom'

import StepCard from '@/components/home/StepCard'
import Container from '@/components/projects/ui/Container'

export default function HowItWorks(): JSX.Element {
	return (
		<section
			style={{
				backgroundImage: 'url(/images/stars.png)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat'
			}}
			className='mt-14 md:mt-0'
		>
			<Container className='py-[4rem] md:py-[8rem] grid justify-items-center gap-20'>
				<header className='text-center show'>
					<p className='text-customGray'>How it works</p>
					<h2 className='text-customWhite'>This is how it works</h2>
				</header>
				<div className='grid md:grid-cols-3 gap-3'>
					<StepCard
						className='md:col-span-2 show'
						title='Step 1'
						step={1}
						description='Buy a token Buy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a token v Buy a token Buy a token Buy a token Buy a token Buy a token Buy a tokenBuy a tokenBuy a token'
					/>
					<StepCard
						className='md:row-span-2 show'
						title='Step 2'
						step={2}
						description='Buy a token Buy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a token v Buy a token Buy a token Buy a token Buy a token Buy a token Buy a tokenBuy a tokenBuy a token'
					/>
					<StepCard
						className='md:row-span-2 show'
						title='Step 3'
						step={3}
						description='Buy a token Buy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a token v Buy a token Buy a token Buy a token Buy a token Buy a token Buy a tokenBuy a tokenBuy a token'
					/>
					<StepCard
						className='md:row-start-3 md:col-start-2 md:col-span-2 show'
						title='Step 4'
						step={4}
						description='Buy a token Buy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a tokenBuy a token v Buy a token Buy a token Buy a token Buy a token Buy a token Buy a tokenBuy a tokenBuy a token'
					/>
				</div>
				<Link to={'/app/projects'} className='btn btn-white'>
					Get Started
				</Link>
			</Container>
		</section>
	)
}
