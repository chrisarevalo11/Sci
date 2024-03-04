import { Link } from 'react-router-dom'

import Container from '@/components/ui/Container'

export default function Hero(): JSX.Element {
	return (
		<section className='w-full h-dvh max-h-dvh'>
			<Container className='h-full max-h-svh grid md:grid-cols-3 md:items-center gap-2 md:gap-5'>
				<div className='flex flex-col gap-10 h-[70%] justify-between mt-20 md:mt-10'>
					<header className='flex flex-col items-start gap-3 md:gap-7'>
						<h3>Quadratic</h3>
						<p className='md:pr-5'>
							Quadratic Voting is a novel method where participants express
							preferences and intensity. Unlike traditional methods, voters use
							credits to vote. However, assigning multiple votes increases
							quadratically, making strong preferences costly.
						</p>
						<Link to='/app/projects' className='btn btn-black'>
							See more
						</Link>
					</header>
					<img
						src='/images/grid1.png'
						alt='grid-1'
						className='hidden md:block w-[300px]'
					/>
				</div>
				<img
					src='/images/slime-bg-black.png'
					alt='hero-image'
					className='h-[200px] w-full md:h-full object-cover rounded-xl md:rounded-none'
				/>
				<div className='flex flex-col gap-10 items-end h-[70%] justify-start md:justify-between md:mt-10'>
					<img
						src='/images/grid2.png'
						alt='grid-2'
						className='hidden md:block w-[300px]'
					/>
					<header className='flex flex-col items-end gap-7'>
						<h3 className='text-right'>Voting</h3>
						<p className='md:pl-5 text-right'>
							This system promotes a more thoughtful and equitable distribution
							of votes, allowing minority voices to significantly influence the
							outcome. It encourages a more representative and balanced
							decision-making process in communities and organizations, ensuring
							that decisions better reflect the values and priorities of the
							entire group.
						</p>
					</header>
				</div>
			</Container>
		</section>
	)
}
