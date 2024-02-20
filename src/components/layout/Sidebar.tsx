import StatCard from '@/components/layout/StatCard'

export default function Sidebar(): JSX.Element {
	return (
		<div className='h-full bg-black hidden md:flex flex-col justify-between py-4 px-4 text-customWhite text-left'>
			<div className='h-[150px] w-full bg-gray-400 rounded-xl' />
			<header>
				<h4>Name of the round</h4>
				<div className='flex items-center gap-2'>
					<div className='size-2 bg-customGreen rounded-full'></div> opened
				</div>
			</header>
			<section className='space-y-4'>
				<StatCard title='total in pool' stat='8k DAI' />
				<StatCard title='matching pool' stat='5k DAI' />
				<StatCard title='total donations' stat='0' />
				<StatCard title='total donators' stat='0' />
			</section>
		</div>
	)
}
