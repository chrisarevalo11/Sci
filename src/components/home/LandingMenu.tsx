import { Link } from 'react-router-dom'

import Container from '@/components/ui/Container'
import Logo from '@/components/ui/Logo'

export default function LandingMenu(): JSX.Element {
	return (
		<nav className='absolute w-full'>
			<Container className='text-customBlack flex justify-between items-center my-3'>
				<Logo />
				<Link className='btn btn-black' to='/app/projects'>
					Launch App
				</Link>
			</Container>
		</nav>
	)
}
