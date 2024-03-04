import { Link } from 'react-router-dom'

import { Round } from '@/models/round.model'

type Props = {
	round: Round
}

export default function CreateCard(props: Props): JSX.Element {
	const { round } = props

	return (
		<div className='rounded-tl-3xl rounded-br-3xl w-full max-w-[290px] h-full min-h-[300px] max-h-[300px] flex items-center p-4 text-center justify-between flex-col border-2 border-customBlack'>
			<h3>Create Project</h3>
			<p>
				Got an innovative idea or a cause you are passionate about? Initiate
				your own project and invite the community to support it. Present your
				vision, outline your goals, and let the collective power of quadratic
				voting help bring your project to life.
			</p>
			<Link
				className='btn btn-green'
				state={{ round }}
				to='/app/create-project'
			>
				Create
			</Link>
		</div>
	)
}
