import { HashRouter, Route, Routes } from 'react-router-dom'

import Home from '@/components/home/Home'
import Layout from '@/components/layout/Layout'
import CreateProject from '@/pages/CreateProject'
import Dashboard from '@/pages/Dashboard'
import Faucet from '@/pages/Faucet'
import Projects from '@/pages/Projects'

import ProjectComponent from './pages/Project'

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
					<Route path='projects/:recipientId' element={<ProjectComponent />} />
				</Route>
			</Routes>
		</HashRouter>
	)
}

export default App
