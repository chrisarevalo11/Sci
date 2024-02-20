import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Logo from '@/components/ui/Logo'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import Cross from '../icons/Cross'
import Menu from '../icons/Menu'

export default function Navbar(): JSX.Element {
	const [open, setOpen] = useState(false)
	const { pathname } = useLocation()

	return (
		<nav className='w-full bg-black py-3 flex justify-between items-center text-white px-5 md:col-span-2'>
			<Link to={'/'} className='flex justify-center items-center'>
				<Logo />
			</Link>
			<div className='md:flex gap-7 hidden items-center'>
				<Link
					to={'/app/projects'}
					className={`hover:opacity-90 ${pathname === '/app/projects' && 'text-customGreen pointer-events-none'}`}
				>
					<h6>Projects</h6>
				</Link>
				<Link
					to={'/app/tokens'}
					className={`hover:opacity-90 ${pathname === '/app/tokens' && 'text-customGreen pointer-events-none'}`}
				>
					<h6>Tokens</h6>
				</Link>
				<Link
					to={'/app/new-round'}
					className={`hover:opacity-90 ${pathname === '/app/new-round' && 'text-customGreen pointer-events-none'}`}
				>
					<h6>New Round</h6>
				</Link>
			</div>

			<div className='hidden md:flex'>
				<ConnectButton />
			</div>

			<div className='md:hidden flex items-center'>
				<button onClick={() => setOpen(true)}>
					<Menu className='size-6' />
				</button>
				<ResponsiveMenu open={open} setOpen={setOpen} />
			</div>
		</nav>
	)
}

function ResponsiveMenu({
	open,
	setOpen
}: {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
	const { pathname } = useLocation()
	return (
		<div
			className={`md:hideen fixed top-0 bottom-0 bg-customGreen transition-all ${open ? 'right-0' : 'right-[-300vw]'}`}
			style={{ width: 'min(90%, 320px)' }}
		>
			<button onClick={() => setOpen(false)}>
				<Cross className='absolute right-5 top-5 size-6' />
			</button>
			<ul className='flex flex-col items-center justify-center gap-5 h-full'>
				<li>
					<Link
						to={'/app/projects'}
						className={`hover:opacity-90 ${pathname === '/app/projects' && 'text-customBlack/70 pointer-events-none'}`}
					>
						<h6>Projects</h6>
					</Link>
				</li>
				<li>
					<Link
						to={'/app/tokens'}
						className={`hover:opacity-90 ${pathname === '/app/tokens' && 'text-customBlack/70 pointer-events-none'}`}
					>
						<h6>Tokens</h6>
					</Link>
				</li>
				<li>
					<Link
						to={'/app/new-round'}
						className={`hover:opacity-90 ${pathname === '/app/new-round' && 'text-customBlack/70 pointer-events-none'}`}
					>
						<h6>New Round</h6>
					</Link>
				</li>
				<li>
					<ConnectButton />
				</li>
			</ul>
		</div>
	)
}