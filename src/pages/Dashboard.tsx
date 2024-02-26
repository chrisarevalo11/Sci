import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import NewRoundForm from '@/components/dashboard/NewRoundForm'
import { profilesApiFirebase } from '@/middlewares/firebase/profile.firebase.middleware'
import { Profile } from '@/models/profile.model'
import { ALLO_PROFILE_ID, SCI_ADMIN_ADDRESS } from '@/utils/variables/constants'

export default function Dashboard(): JSX.Element {
	const { address } = useAccount()

	const { getProfileByAddress } = profilesApiFirebase()

	const [loading, setLoading] = useState<boolean>(true)

	const navigate = useNavigate()

	return (
		<section className='w-full h-full p-4 md:p-10 relative'>
			<header className='flex justify-end pb-3 border-b-4 items-center border-customBlack border-dashed'>
				<h2>Dashboard</h2>
			</header>
			<div className='mt-10 flex flex-col justify-center items-center'>
				<NewRoundForm />
			</div>
			<img
				src='/images/slime-no-bg.webp'
				alt='slime'
				className='absolute rotate-45 -z-10 right-[-20px] top-[100px] '
			/>
		</section>
	)
}
