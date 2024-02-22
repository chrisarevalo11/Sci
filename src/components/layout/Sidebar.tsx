import { useEffect, useState } from 'react'

import Countdown from '@/components/layout/Countdown'
import StatCard from '@/components/layout/StatCard'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Round } from '@/models/round.model'
import { convertTimestampToDate } from '@/utils'

export default function Sidebar(): JSX.Element {
	const { getLastRound } = roundsApiFirebase()

	const [loading, setLoading] = useState<boolean>(true)
	const [round, setRound] = useState<Round | null>(null)
	const [totalPool, setTotalPool] = useState<number>(0)

	const [registraionStartTime, setRegistrationStartTime] = useState<Date>(
		new Date()
	)
	const [registraionEndTime, setRegistrationEndTime] = useState<Date>(
		new Date()
	)

	const [allocationStartTime, setAllocationStartTime] = useState<Date>(
		new Date()
	)
	const [allocationEndTime, setAllocationEndTime] = useState<Date>(new Date())

	const getStates = async () => {
		try {
			const lastRound: Round = await getLastRound()
			setRound(lastRound)
			setTotalPool(lastRound.machingPool + lastRound.donations)

			setRegistrationStartTime(
				new Date(convertTimestampToDate(lastRound.registrationStartTime))
			)
			setRegistrationEndTime(
				new Date(convertTimestampToDate(lastRound.registrationEndTime))
			)
			setAllocationStartTime(
				new Date(convertTimestampToDate(lastRound.allocationStartTime))
			)
			setAllocationEndTime(
				new Date(convertTimestampToDate(lastRound.allocationEndTime))
			)

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
				<div className='h-full bg-black md:flex hidden flex-col justify-around xl:justify-start pb-1 2xl:pb-3 xl:gap-6 px-4 text-customWhite text-left'>
					<img
						src={round?.image}
						alt='Round Thumbnail'
						className='h-[150px] w-full rounded-xl'
					/>
					<header>
						<h5>{round?.name}</h5>
						<div className='flex items-center gap-2 mt-2'>
							<div
								className={`size-2 rounded-full ${
									new Date() > registraionStartTime &&
									new Date() < registraionEndTime
										? 'bg-green-700'
										: 'bg-red-700'
								}`}
							></div>
							{new Date() > registraionStartTime &&
							new Date() < registraionEndTime
								? ' Opened'
								: ' Closed'}
						</div>
					</header>
					{Date.now() < registraionEndTime.getTime() ? (
						<div className='flex items-center justify-between px-2 gap-4'>
							<h5 className='flex flex-col text-left'>
								<span>time</span> <span>left</span>
							</h5>
							<Countdown targetDate={registraionEndTime} />
						</div>
					) : Date.now() < allocationEndTime.getTime() ? (
						<div className='flex items-center justify-between px-2 gap-4'>
							<h5 className='flex flex-col text-left'>
								<span>time</span> <span>left</span>
							</h5>
							<Countdown targetDate={allocationEndTime} />
						</div>
					) : null}
					<section className='space-y-2 2xl:space-y-4'>
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
