import { Link } from 'react-router-dom'

import StepCard from '@/components/home/StepCard'
import Container from '@/components/ui/Container'

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
					<h2 className='text-customWhite'>This is how it works</h2>
				</header>
				<div className='grid md:grid-cols-3 gap-3'>
					<StepCard
						className='md:col-span-2 show'
						title='STEP 1: Remember to Visit the Faucet'
						step={1}
						description='Head to our Faucet to receive voting credits. Think of these as currency to support the options or projects you prefer. Manage your credits wisely, as they are limited.'
					/>
					<StepCard
						className='md:row-span-2 show'
						title='STEP 2: Register Your Project'
						step={2}
						description='If you have a project that needs funding, register it. Make sure to detail your proposal so that voters understand and support your initiative.'
					/>
					<StepCard
						className='md:row-span-2 show'
						title='STEP 3: Donate and Vote'
						step={3}
						description='Use your credits to donate and vote for the projects that interest you the most. Remember, casting multiple votes for the same project has a quadratic cost, so distribute your credits strategically.'
					/>
					<StepCard
						className='md:row-start-3 md:col-start-2 md:col-span-2 show'
						title='STEP 4: Await the Results'
						step={4}
						description='After the voting round concludes, the administrator will tally and distribute funds according to the votes each project has received. Your participation makes a difference!'
					/>
				</div>
				<Link to={'/app/projects'} className='btn btn-white'>
					Get Started
				</Link>
			</Container>
		</section>
	)
}
