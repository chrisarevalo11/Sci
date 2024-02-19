import Footer from '@/components/home/Footer'
import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import LandingMenu from '@/components/home/LandingMenu'

export default function Home(): JSX.Element {
	return (
		<section>
			<LandingMenu />
			<Hero />
			<HowItWorks />
			<Footer />
		</section>
	)
}
