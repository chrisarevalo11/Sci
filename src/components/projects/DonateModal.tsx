import DonateModalSteps from '@/components/projects/steps/DonateModalSteps'
import { DialogContent } from '@/components/ui/dialog'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'

type Props = {
	round: Round
	project: Project
}

export default function DonateModal(props: Props): JSX.Element {
	const { round, project } = props
	return (
		<DialogContent>
			<DonateModalSteps round={round} project={project} />
		</DialogContent>
	)
}
