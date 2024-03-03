import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { useAppSelector } from '@/store'

export default function Votation(): JSX.Element {
	// TODO: onClick to close the modal
	const isLoading: boolean = useAppSelector(state => state.ui.isLoading)

	return (
		<DialogHeader>
			<DialogTitle>Vote for the project</DialogTitle>
			<DialogDescription>
				This transaction will allocate voting tokens to the project. Please wait
				for the confirmation after clicking on the button.
			</DialogDescription>
			<DialogFooter>
				<button className='btn btn-green !mt-5' disabled={isLoading}>
					{isLoading ? 'Voting...' : 'Voted!'}
				</button>
			</DialogFooter>
		</DialogHeader>
	)
}
