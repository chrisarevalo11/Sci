import {
	DialogDescription,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'

export default function Votation(): JSX.Element {
	return (
		<DialogHeader>
			<DialogTitle>Vote for the project</DialogTitle>
			<DialogDescription>
				This transaction will allocate voting tokens to the project. Please wait
				for the confirmation after clicking on the button.
			</DialogDescription>
		</DialogHeader>
	)
}
