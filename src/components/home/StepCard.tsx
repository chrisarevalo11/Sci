import { cn } from '@/utils'

type Props = {
	title: string
	step: number
	description: string
	className?: string
}

export default function StepCard(props: Props): JSX.Element {
	const { title, step, description, className } = props

	return (
		<div
			className={cn(
				'flex flex-col gap-5 p-2 text-customWhite bg-transparentGray',
				className
			)}
		>
			<header className='flex gap-3'>
				<span className='font-dela size-8 flex justify-center items-center bg-customGreen'>
					{step}
				</span>
				<h4>{title}</h4>
			</header>
			<p>{description}</p>
		</div>
	)
}
