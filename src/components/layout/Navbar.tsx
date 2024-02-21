import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'

import Cross from '@/components/icons/Cross'
import Menu from '@/components/icons/Menu'
import Logo from '@/components/ui/Logo'
import { SCI_ADMIN_ADDRESS } from '@/utils/variables/constants'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar(): JSX.Element {
	const { address } = useAccount()
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
				{address && (
					<Link
						to={'/app/faucet'}
						className={`hover:opacity-90 ${pathname === '/app/faucet' && 'text-customGreen pointer-events-none'}`}
					>
						<h6>Faucet</h6>
					</Link>
				)}
				{address === SCI_ADMIN_ADDRESS && (
					<Link
						to={'/app/dashboard'}
						className={`hover:opacity-90 ${pathname === '/app/dashboard' && 'text-customGreen pointer-events-none'}`}
					>
						<h6>Dashboard</h6>
					</Link>
				)}
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
	const { address } = useAccount()
	const { pathname } = useLocation()
	return (
		<div
			className={`md:hideen fixed top-0 bottom-0 z-[100] bg-customGreen transition-all ${open ? 'right-0' : 'right-[-300vw]'}`}
			style={{ width: 'min(90%, 320px)' }}
		>
			<button onClick={() => setOpen(false)}>
				<Cross className='absolute right-5 top-5 size-6' />
			</button>
			<ul className='flex flex-col items-center justify-center gap-5 h-full'>
				<li>
					<Link
						to={'/app/projects'}
						onClick={() => setOpen(false)}
						className={`hover:opacity-90 ${pathname === '/app/projects' && 'text-customBlack/70 pointer-events-none'}`}
					>
						<h6>Projects</h6>
					</Link>
				</li>
				{address && (
					<li>
						<Link
							to={'/app/faucet'}
							className={`hover:opacity-90 ${pathname === '/app/faucet' && 'text-customBlack/70  pointer-events-none'}`}
							onClick={() => setOpen(false)}
						>
							<h6>Faucet</h6>
						</Link>
					</li>
				)}
				{address === SCI_ADMIN_ADDRESS && (
					<Link
						to={'/app/dashboard'}
						className={`hover:opacity-90 ${pathname === '/app/dashboard' && 'text-customBlack/70 pointer-events-none'}`}
						onClick={() => setOpen(false)}
					>
						<h6>Dashboard</h6>
					</Link>
				)}

				<li>
					<ConnectButton />
				</li>
			</ul>
		</div>
	)
}
