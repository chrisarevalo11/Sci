// import { useEffect, useState } from 'react'
// import { ethers } from 'ethers'
import { Outlet } from 'react-router-dom'

// import { useAccount } from 'wagmi'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
// import { CHAIN_ID, NETWORK_CHANGE_MESSAGE } from '@/constants'

export default function Layout() {
	// const { address } = useAccount()
	// const [isListening, setIsListening] = useState<boolean>(true)

	// useEffect(() => {
	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	const ethereum = (window as any).ethereum

	// 	if (!ethereum) {
	// 		console.log('Ethereum object not found')
	// 		return
	// 	}

	// 	const currentNetwork = async () => {
	// 		const web3Provider: ethers.BrowserProvider = new ethers.BrowserProvider(
	// 			ethereum
	// 		)
	// 		const web3ProviderNetwork: ethers.Network =
	// 			await web3Provider.getNetwork()
	// 		return Number(web3ProviderNetwork.chainId)
	// 	}

	// 	const handleAccountsChanged = async () => {
	// 		const chainId: number = await currentNetwork()
	// 		if (chainId === CHAIN_ID) {
	// 			// await getStates()
	// 		} else {
	// 			// navigate('/')
	// 			// resetStates()
	// 		}
	// 	}

	// 	const handleChainChanged = async () => {
	// 		const chainId: number = await currentNetwork()
	// 		if (chainId === CHAIN_ID) {
	// 			setIsListening(false)
	// 			// await getStates()
	// 		} else {
	// 			setIsListening(true)
	// 			// navigate('/')
	// 			// resetStates()
	// 			alert(NETWORK_CHANGE_MESSAGE)
	// 		}
	// 	}

	// 	// Add event listeners
	// 	if (isListening) {
	// 		ethereum.on('accountsChanged', handleAccountsChanged)
	// 	}

	// 	ethereum.on('chainChanged', handleChainChanged)

	// 	// Initial check
	// 	;(async () => {
	// 		if (address && (await currentNetwork()) === CHAIN_ID) {
	// 			setIsListening(false)
	// 			// await getStates()
	// 		}

	// 		// if (isDisconnected) {
	// 		// 	navigate('/')
	// 		// 	// resetStates()
	// 		// }
	// 	})()

	// 	// Remove event listeners on cleanup
	// 	return () => {
	// 		if (ethereum.removeListener) {
	// 			ethereum.removeListener('accountsChanged', handleAccountsChanged)
	// 			ethereum.removeListener('chainChanged', handleChainChanged)
	// 		}
	// 	}

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [address]) // Depend on address to re-run when it changes

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
