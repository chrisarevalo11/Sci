export default function StatCard({
	title,
	stat
}: {
	title: string
	stat: string
}): JSX.Element {
	return (
		<div className='flex justify-between items-center px-4 py-2 bg-transparentGray'>
			<h5 className='text-left max-w-[120px]'>{title}</h5>
			<h5 className='text-customGreen'>{stat}</h5>
		</div>
	)
}
