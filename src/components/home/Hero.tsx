import Container from '@/components/projects/ui/Container'

export default function Hero(): JSX.Element {
	return (
		<section className='w-full h-dvh max-h-dvh'>
			<Container className='h-full max-h-svh grid md:grid-cols-3 md:items-center gap-2 md:gap-5'>
				<div className='flex flex-col gap-10 h-[70%] justify-between mt-20 md:mt-10'>
					<header className='flex flex-col items-start gap-3 md:gap-7'>
						<h3>crowdfunding</h3>
						<p className='md:pr-5'>
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab
							inventore quis reprehenderit deleniti cumque sequi itaque
							consequuntur, amet eligendi, quas voluptates modi aliquid animi
							quisquam impedit quidem, iste eum ea?
						</p>
						<a href='#' className='btn btn-black'>
							See more
						</a>
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
						<h3 className='text-right'>science</h3>
						<p className='md:pl-5 text-right'>
							Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab
							inventore quis reprehenderit deleniti cumque sequi itaque
							consequuntur, amet eligendi, quas voluptates modi aliquid animi
							quisquam impedit quidem, iste eum ea?
						</p>
					</header>
				</div>
			</Container>
		</section>
	)
}
