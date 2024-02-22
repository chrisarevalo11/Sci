import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'

export default function Projects(): JSX.Element {
	const { getLastRound, updateRound } = roundsApiFirebase()

	const [loading, setLoading] = useState<boolean>(true)
	const [projects, setProjects] = useState<Project[]>([])
	const [round, setRound] = useState<Round | null>(null)
	const [syncronized, setSyncronized] = useState<boolean>(false)

	const getStates = async () => {
		try {
			const lastRound: Round = await getLastRound()
			setRound(lastRound)

			if (lastRound.projects) {
				setProjects(lastRound.projects)
			}

			setSyncronized(true)
			setLoading(false)
		} catch (error) {
			alert('Error: Look at console')
			console.error(error)
			setLoading(false)
		}
	}

	useEffect(() => {
		;(async () => {
			await getStates()
		})()
	}, [])

	return (
		<div>
			<h1>Projects</h1>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					{projects.map((project: Project) => (
						<div key={project.name}>
							<h2>{project.name}</h2>
							<p>{project.description}</p>
							<Link
								to={`/app/projects/${project.recipientId}`}
								state={{ round, project }}
							>
								Details
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
