import React from 'react'
import ReactDOM from 'react-dom/client'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import {
	darkTheme,
	getDefaultWallets,
	RainbowKitProvider
} from '@rainbow-me/rainbowkit'

import App from './App'
import { PROJECT_ID } from './constants'

import './index.css'
import '@rainbow-me/rainbowkit/styles.css'

import '@fontsource/dela-gothic-one'

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? polygonMumbai : polygon],
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
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider
				chains={chains}
				theme={darkTheme({
					accentColor: '#111',
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
	</React.StrictMode>
)
