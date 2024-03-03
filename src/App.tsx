import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAccount } from 'wagmi'

import Layout from '@/components/layout/Layout'
import CreateProject from '@/pages/CreateProject'
import Dashboard from '@/pages/Dashboard'
import Faucet from '@/pages/Faucet'
import Home from '@/pages/Home'
import Projects from '@/pages/Projects'
import { AppDispatch } from '@/store'

import ProjectComponent from './pages/Project'
import { destroyERC20Details } from './store/slides/erc20Details.slice'

import 'react-toastify/dist/ReactToastify.css'

function App() {
	const { isDisconnected } = useAccount()
	const dispatch = useDispatch<AppDispatch>()

	useEffect(() => {
		if (isDisconnected) {
			dispatch(destroyERC20Details(''))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isDisconnected])

	return (
		<>
			<HashRouter>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/app' element={<Layout />}>
						<Route path='create-project' element={<CreateProject />} />
						<Route path='dashboard' element={<Dashboard />} />
						<Route path='faucet' element={<Faucet />} />
						<Route path='projects' element={<Projects />} />
						<Route
							path='projects/:recipientId'
							element={<ProjectComponent />}
						/>
					</Route>
				</Routes>
			</HashRouter>
			<ToastContainer />
		</>
	)
}

export default App
