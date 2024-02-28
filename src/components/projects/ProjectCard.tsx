import { Link } from 'react-router-dom'

import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'

type Props = {
	project: Project
	round: Round | null
}

export default function ProjectCard(props: Props): JSX.Element {
	const { project, round } = props
	return (
		<div className='rounded-tl-3xl rounded-br-3xl w-full max-w-[290px] h-full min-h-[300px] max-h-[300px] flex flex-col overflow-hidden'>
			<div className='h-1/3 w-full relative'>
				<img
					src={project.banner}
					alt={project.name}
					className='h-full w-full object-cover'
				/>
				<img
					src={project.logo}
					alt={project.name}
					className='absolute size-10 left-5 -bottom-5'
				/>
			</div>
			<div className='flex flex-col h-2/3 gap-4 p-4 bg-customBlack text-customWhite'>
				<h4 className='text-right line-clamp-1'>{project.name}</h4>
				<p className='line-clamp-3 min-h-[72px]'>{project.description}</p>
				<Link
					className='btn mx-auto btn-green'
					to={`/app/projects/${project.recipientId}`}
					state={{ round, project }}
				>
					See more
				</Link>
			</div>
		</div>
	)
}
