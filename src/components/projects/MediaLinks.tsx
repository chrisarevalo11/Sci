import Github from '@/components/icons/Github'
import Globe from '@/components/icons/Globe'
import Twitter from '@/components/icons/Twitter'
import { Project } from '@/models/project.model'

type Props = {
	project: Project
}

export default function MediaLinks(props: Props): JSX.Element {
	const { project } = props
	return (
		<div className='mt-6 flex gap-3 justify-center flex-col items-start'>
			<h5>Media</h5>
			<a
				href={project.website}
				target='_blank'
				rel='noreferrer'
				className='flex gap-2 underline'
			>
				<Globe className='size-5' />
				{project.website}
			</a>
			<a
				href={project.twitter}
				target='_blank'
				rel='noreferrer'
				className='flex gap-2 underline'
			>
				<Twitter className='size-5' />
				{project.twitter}
			</a>
			<a
				href={project.github}
				target='_blank'
				rel='noreferrer'
				className='flex gap-2 underline'
			>
				<Github className='size-5' />
				{project.github}
			</a>
		</div>
	)
}
