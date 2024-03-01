import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import CreateProjectForm from '@/components/create/CreateProjectForm'
import { Round } from '@/models/round.model'
import { AppDispatch, useAppSelector } from '@/store'
import { getLastRound } from '@/store/thunks/round.thunk'
import { SCI_ADMIN_ADDRESS } from '@/utils/variables/constants'

export default function CreateProject(): JSX.Element {
	const { address } = useAccount()

	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	const lastRound: Round = useAppSelector(state => state.round.lastRound)
	const lastRoundFetched = useAppSelector(state => state.round.lastRoundFetched)

	useEffect(() => {
		if (
			!address ||
			address === SCI_ADMIN_ADDRESS ||
			lastRound?.projects.some(project => project.recipientId === address)
		) {
			navigate('/app/projects')
			return
		}

		if (!lastRoundFetched) {
			dispatch(getLastRound())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address])

	return (
		<section className='w-full h-[max(100%, fit-content)] p-4 md:p-10 relative'>
			<header className='flex justify-end pb-3 border-b-4 items-center border-customBlack border-dashed'>
				<h2>Create Project</h2>
			</header>

			<CreateProjectForm />

			<img
				src='/images/slime-no-bg.webp'
				alt='slime'
				className='fixed rotate-180 -z-10 right-[-20px] top-[180px] '
			/>
		</section>
	)
}
