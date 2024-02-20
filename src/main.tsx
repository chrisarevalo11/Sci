import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import {
	darkTheme,
	getDefaultWallets,
	RainbowKitProvider
} from '@rainbow-me/rainbowkit'

import App from './App'
import { PROJECT_ID } from './constants'
import { store } from './store'

import './index.css'
import '@rainbow-me/rainbowkit/styles.css'

import '@fontsource/dela-gothic-one'

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? bscTestnet : bsc],
	[publicProvider()]
)

const { connectors } = getDefaultWallets({
	appName: 'Cuadratic Science',
	projectId: PROJECT_ID,
	chains
})

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<WagmiConfig config={wagmiConfig}>
				<RainbowKitProvider
					chains={chains}
					theme={darkTheme({
						accentColor: '#00D000',
						accentColorForeground: 'white',
						borderRadius: 'large',
						fontStack: 'system',
						overlayBlur: 'small'
					})}
					modalSize='compact'
				>
					<App />
				</RainbowKitProvider>
			</WagmiConfig>
		</Provider>
	</React.StrictMode>
)
