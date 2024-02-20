import { Link, useLocation } from 'react-router-dom'

import Logo from '@/components/ui/Logo'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar(): JSX.Element {
	const { pathname } = useLocation()
	console.log(pathname)

	return (
		<nav className='w-full bg-black py-3 flex justify-between items-center text-white px-5 md:col-span-2'>
			<Link to={'/'} className='flex justify-center items-center'>
				<Logo />
			</Link>
			<div className='flex gap-7 items-center'>
				<Link
					to={'/app/projects'}
					className={`hover:opacity-90 ${pathname === '/app/projects' && 'text-customGreen pointer-events-none'}`}
				>
					<h6>Projects</h6>
				</Link>
				<Link
					to={'/app/faucet'}
					className={`hover:opacity-90 ${pathname === '/app/tokens' && 'text-customGreen pointer-events-none'}`}
				>
					<h6>Faucet</h6>
				</Link>
				<Link
					to={'/app/dashboard'}
					className={`hover:opacity-90 ${pathname === '/app/dashboard' && 'text-customGreen pointer-events-none'}`}
				>
					<h6>Dashboard</h6>
				</Link>
			</div>
			<ConnectButton />
		</nav>
	)
}
