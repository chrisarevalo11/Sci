import { useEffect } from 'react'

import Footer from '@/components/home/Footer'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import LandingMenu from '@/components/home/LandingMenu'

export default function Home(): JSX.Element {
	useEffect(() => {}, [])

	return (
		<section>
			<LandingMenu />
			<Hero />
			<HowItWorks />
			<Footer />
		</section>
	)
}
