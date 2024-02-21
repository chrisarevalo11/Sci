import { useEffect, useState } from 'react'

import StatCard from '@/components/layout/StatCard'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Round } from '@/models/round.model'

export default function Sidebar(): JSX.Element {
	const { getLastRound } = roundsApiFirebase()

	const [loading, setLoading] = useState<boolean>(true)
	const [round, setRound] = useState<Round | null>(null)
	const [syncronized, setSyncronized] = useState<boolean>(false)
	const [totalPool, setTotalPool] = useState<number>(0)

	const getStates = async () => {
		try {
			const lastRound: Round = await getLastRound()
			setRound(lastRound)
			setTotalPool(lastRound.machingPool + lastRound.donations)

			setSyncronized(true)
			setLoading(false)
		} catch (error) {
			alert('Error: Look at console')
			console.error(error)
			setLoading(false)
		}
	}

	useEffect(() => {
		getStates()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className='h-full bg-black flex flex-col justify-between py-4 px-4 text-customWhite text-left'>
					<img
						src={round?.image}
						alt='Round Thumbnail'
						className='h-[150px] w-full rounded-xl'
					/>
					<header>
						<h4>{round?.name}</h4>
						<div className='flex items-center gap-2'>
							<div
								className={`size-2 rounded-full ${
									// @ts-ignore
									new Date().getTime() < round?.registrationEndTime
										? 'bg-green-700'
										: 'bg-red-700'
								}`}
							></div>
							{/* @ts-ignore */}
							{new Date().getTime() < round?.registrationEndTime
								? ' Opened'
								: ' Closed'}
						</div>
					</header>
					<section className='space-y-4'>
						<StatCard title='Total in pool' stat={`${totalPool} DAI`} />
						<StatCard
							title='Matching pool'
							stat={`${round?.machingPool} DAI`}
						/>
						<StatCard
							title='Total donations'
							stat={`${round?.donations} DAI`}
						/>
						<StatCard title='Total donators' stat={`${round?.donators}`} />
					</section>
				</div>
			)}
		</>
	)
}
