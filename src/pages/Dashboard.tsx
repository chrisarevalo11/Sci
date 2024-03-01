import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import NewRoundForm from '@/components/dashboard/NewRoundForm'
import { AppDispatch, useAppSelector } from '@/store'
import { getLastRound } from '@/store/thunks/round.thunk'
import { SCI_ADMIN_ADDRESS } from '@/utils/variables/constants'

export default function Dashboard(): JSX.Element {
	const { address } = useAccount()

	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	const lastRoundFetched = useAppSelector(state => state.round.lastRoundFetched)

	useEffect(() => {
		if (!address || address !== SCI_ADMIN_ADDRESS) {
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
				<h2>Dashboard</h2>
			</header>
			<div className='mt-10 flex flex-col justify-center items-center'>
				<NewRoundForm />
			</div>
			<img
				src='/images/slime-no-bg.webp'
				alt='slime'
				className='absolute rotate-90 -z-10 left-[-20px] top-[100px] '
			/>
		</section>
	)
}
