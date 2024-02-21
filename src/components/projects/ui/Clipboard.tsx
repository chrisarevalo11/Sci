import Check from '@/components/icons/Check'
import Copy from '@/components/icons/Copy'
import { useClipboard } from '@/hooks/useClipboard'
import { cn } from '@/utils'

export default function Clipboard({
	text,
	children,
	className
}: {
	text: string
	children?: React.ReactNode
	className?: string
}): JSX.Element {
	const [copy, copied] = useClipboard()

	return (
		<div className={cn('flex items-center gap-3 text-customGreen', className)}>
			{children}
			<button onClick={() => copy(text)} style={{ cursor: 'pointer' }}>
				{copied ? <Check /> : <Copy />}
			</button>
		</div>
	)
}
