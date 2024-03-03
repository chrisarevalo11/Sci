import { useEffect, useState } from 'react'

import Countdown from '@/components/layout/Countdown'
import StatCard from '@/components/layout/StatCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Round } from '@/models/round.model'
import { useAppSelector } from '@/store'
import { convertTimestampToDate } from '@/utils'

export default function Sidebar(): JSX.Element {
	const [allocationEndTime, setAllocationEndTime] = useState<Date>(new Date())
	const [allocationStartTime, setAllocationStartTime] = useState<Date>(
		new Date()
	)
	const [registrationStartTime, setRegistrationStartTime] = useState<Date>(
		new Date()
	)
	const [registrationEndTime, setRegistrationEndTime] = useState<Date>(
		new Date()
	)

	const lastRound: Round = useAppSelector(state => state.round.lastRound)
	const lastRoundFetched: boolean = useAppSelector(
		state => state.round.lastRoundFetched
	)

	const getStates = async () => {
		setAllocationEndTime(
			new Date(convertTimestampToDate(lastRound.allocationEndTime))
		)
		setAllocationStartTime(
			new Date(convertTimestampToDate(lastRound.allocationStartTime))
		)
		setRegistrationEndTime(
			new Date(convertTimestampToDate(lastRound.registrationEndTime))
		)
		setRegistrationStartTime(
			new Date(convertTimestampToDate(lastRound.registrationStartTime))
		)
	}

	useEffect(() => {
		getStates()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastRoundFetched, lastRound])

	return (
		<>
			<div className='h-full bg-black md:flex hidden flex-col justify-around xl:justify-start pb-1 2xl:pb-3 xl:gap-6 px-4 text-customWhite text-left'>
				{!lastRoundFetched ? (
					<div className='flex flex-col space-y-3'>
						<Skeleton className='h-[200px] w-full rounded-xl' />
						<div className='space-y-4'>
							<Skeleton className='h-4 w-full rounded-xl' />
							<Skeleton className='h-4 w-full rounded-xl' />
							<div className='mt-10 space-y-4'>
								<Skeleton className='h-10 w-full' />
								<Skeleton className='h-10 w-full' />
								<Skeleton className='h-10 w-full' />
								<Skeleton className='h-10 w-full' />
							</div>
						</div>
					</div>
				) : (
					<>
						<img
							src={
								lastRound.image ||
								'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F1.bp.blogspot.com%2F-OfCgL8DBaa8%2FVjzSupDXtrI%2FAAAAAAAAAhE%2FaTAeDA-5oyY%2Fs1600%2Fcave-paintings-lascaux.jpg&f=1&nofb=1&ipt=b52c45465d631d07392b0a1778015d5095ef055cfa2a2a6f69dfd5bca0ee921c&ipo=images'
							}
							alt='Round Thumbnail'
							className='h-[150px] w-full rounded-xl'
						/>
						<header>
							<h5>{lastRound.name || 'Zero rounds'}</h5>
							<div className='flex items-center gap-2 mt-2'>
								<div
									className={`size-2 rounded-full ${
										new Date() > registrationStartTime &&
										new Date() < registrationEndTime
											? 'bg-green-700'
											: 'bg-red-700'
									}`}
								></div>
								{new Date() > registrationStartTime &&
								new Date() < registrationEndTime
									? ' Opened'
									: ' Closed'}
							</div>
						</header>
						{lastRound.distributed && (
							<section className='space-2 2xl:space-y-4'>
								<StatCard title='Round completed' stat={''} />
							</section>
						)}
						{Date.now() < registrationStartTime.getTime() && (
							<div className='flex items-center justify-between px-2 gap-4'>
								<h5 className='flex flex-col text-left'>
									<span>Next</span> <span>Round</span>
								</h5>
								<Countdown targetDate={registrationStartTime} />
							</div>
						)}
						{Date.now() > registrationStartTime.getTime() &&
						Date.now() < registrationEndTime.getTime() ? (
							<div className='flex items-center justify-between px-2 gap-4'>
								<h5 className='flex flex-col text-left'>
									<span>Registry</span> <span>time</span>
								</h5>
								<Countdown targetDate={registrationEndTime} />
							</div>
						) : Date.now() > registrationEndTime.getTime() &&
						  Date.now() < allocationStartTime.getTime() ? (
							<div className='flex items-center justify-between px-2 gap-4'>
								<h5 className='flex flex-col text-left'>
									<span>Voting</span> <span>starts</span>
								</h5>
								<Countdown targetDate={allocationStartTime} />
							</div>
						) : Date.now() > allocationStartTime.getTime() &&
						  Date.now() < allocationEndTime.getTime() ? (
							<div className='flex items-center justify-between px-2 gap-4'>
								<h5 className='flex flex-col text-left'>
									<span>Voting</span> <span>time</span>
								</h5>
								<Countdown targetDate={allocationEndTime} />
							</div>
						) : null}
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
								stat={`${lastRound.donators?.length || 0}`}
							/>
						</section>
					</>
				)}
			</div>
		</>
	)
}
