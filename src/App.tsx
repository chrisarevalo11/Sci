import { HashRouter, Route, Routes } from 'react-router-dom'

import Home from '@/components/home/Home'
import Layout from '@/components/layout/Layout'
import Projects from '@/components/projects/Projects'

import CreateProject from './pages/CreateProject'
import Dashboard from './pages/Dashborad'
import Faucet from './pages/Faucet'

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/app' element={<Layout />}>
					<Route path='create-project' element={<CreateProject />} />
					<Route path='dashboard' element={<Dashboard />} />
					<Route path='faucet' element={<Faucet />} />
					<Route path='projects' element={<Projects />} />
				</Route>
			</Routes>
		</HashRouter>
	)
}

export default App
