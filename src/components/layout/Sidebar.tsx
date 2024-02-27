import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Countdown from '@/components/layout/Countdown'
import StatCard from '@/components/layout/StatCard'
import { Round } from '@/models/round.model'
import { AppDispatch, useAppSelector } from '@/store'
import { getRound } from '@/store/thunks/round.thunk'
import { convertTimestampToDate } from '@/utils'

export default function Sidebar(): JSX.Element {
	const dispatch = useDispatch<AppDispatch>()

	const lastRound: Round = useAppSelector(state => state.round.lastRound)

	const lastRoundFetched: boolean = useAppSelector(
		state => state.round.lastRoundFetched
	)

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
	}

	useEffect(() => {
		getStates()

		dispatch(getRound())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastRoundFetched])

	return (
		<>
			<div className='h-full bg-black md:flex hidden flex-col justify-around xl:justify-start pb-1 2xl:pb-3 xl:gap-6 px-4 text-customWhite text-left'>
				{!lastRoundFetched ? (
					<h5>Loading...</h5>
				) : (
					<>
						<img
							src={
								lastRound.image ||
								'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi0.wp.com%2Fhipertextual.com%2Fwp-content%2Fuploads%2F2016%2F09%2Fvoyager-golden-record.jpg%3Fw%3D1560%26ssl%3D1&f=1&nofb=1&ipt=2514afa8e1fca1ac34c3fa0892ce7af65730b473534f019c9a568e58bab36b4a&ipo=images'
							}
							alt='Round Thumbnail'
							className='h-[150px] w-full rounded-xl'
						/>
						<header>
							<h5>
								{lastRound.name ||
									'"Somewhere, something incredible is waiting to be known" - Carl Sagan'}
							</h5>
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
						{lastRound.distributed ? (
							'Distributed  🎉'
						) : (
							<>
								{Date.now() < registraionEndTime.getTime() ? (
									<div className='flex items-center justify-between px-2 gap-4'>
										<h5 className='flex flex-col text-left'>
											<span>Regi...</span> <span>Time</span>
										</h5>
										<Countdown targetDate={registraionEndTime} />
									</div>
								) : Date.now() < allocationEndTime.getTime() ? (
									<div className='flex items-center justify-between px-2 gap-4'>
										<h5 className='flex flex-col text-left'>
											<span>Vota...</span> <span>time</span>
										</h5>
										<Countdown targetDate={allocationEndTime} />
									</div>
								) : null}
							</>
						)}
						<section className='space-y-2 2xl:space-y-4'>
							<StatCard
								title='Total in pool'
								stat={`${lastRound.totalPool || 0} DAI`}
							/>
							<StatCard
								title='Matching pool'
								stat={`${lastRound.machingPool || 0} DAI`}
							/>
							<StatCard
								title='Total donations'
								stat={`${lastRound.donations || 0} DAI`}
							/>
							<StatCard
								title='Total donators'
								stat={`${lastRound.donators || 0}`}
							/>
						</section>
					</>
				)}
			</div>
		</>
	)
}
