export default function StatCard({
	title,
	stat
}: {
	title: string
	stat: string
}): JSX.Element {
	return (
		<div className='flex justify-between items-center px-4 py-1 2xl:py-2 bg-transparentGray'>
			<h6 className='text-left max-w-[120px]'>{title}</h6>
			<h6 className='text-customGreen text-right'>{stat}</h6>
		</div>
	)
}
