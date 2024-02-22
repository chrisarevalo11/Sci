import { useLocation, useParams } from 'react-router-dom'

export default function Project(): JSX.Element {
	const location = useLocation()
	const { recipientId } = useParams()
	const { project } = location.state

	return (
		<>
			<div>
				<h2>Project Details</h2>
				<p>Project ID: {recipientId}</p>
				<p>Project Name: {project?.name}</p>
				<p>Project Description: {project?.description}</p>
				<p>Project Github: {project?.github}</p>
				<img src={project?.logo} alt='Project Logo' />
				<img src={project?.banner} alt='Project Banner' />
				<p>Project Tags: {project?.tags}</p>
				<p>Project Twitter: {project?.twitter}</p>
				<p>Project Website: {project?.website}</p>
			</div>
		</>
	)
}
