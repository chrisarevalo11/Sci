import { cn } from '@/utils/functions'

export default function Container({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) {
	return (
		<div className={cn('w-full mx-auto max-w-[1250px] px-2', className)}>
			{children}
		</div>
	)
}
