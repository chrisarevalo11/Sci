import { Outlet } from 'react-router-dom'

import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'

export default function Layout() {
	return (
		<div
			className='min-h-dvh md:max-h-dvh flex flex-col md:grid'
			style={{
				gridTemplateRows: 'auto 1fr',
				gridTemplateColumns: 'min(30%, 320px) 1fr'
			}}
		>
			<Navbar />
			<Sidebar />
			<main className='md:overflow-y-auto overflow-x-hidden grow'>
				<Outlet />
			</main>
		</div>
	)
}
