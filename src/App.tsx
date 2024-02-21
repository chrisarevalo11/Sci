import { HashRouter, Route, Routes } from 'react-router-dom'

import Home from '@/components/home/Home'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import Faucet from '@/pages/Faucet'
import Projects from '@/pages/Projects'

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/app' element={<Layout />}>
					<Route path='projects' element={<Projects />} />
					<Route path='faucet' element={<Faucet />} />
					<Route path='dashboard' element={<Dashboard />} />
				</Route>
			</Routes>
		</HashRouter>
	)
}

export default App
