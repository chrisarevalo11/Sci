// // import commemorativeNftMumbaiJson from '@/assets/json/contracts/sync-hub-commemorative-nft-mumbai.json'
// // import commemorativeNftPolygonJson from '@/assets/json/contracts/sync-hub-commemorative-nft-polygon.json'

// const setCommemorativeNftAddress = () =>
// 	import.meta.env.VITE_ENABLE_TESTNETS === 'true'
// 		? commemorativeNftMumbaiJson.address
// 		: commemorativeNftPolygonJson.address

const setChainId = () =>
	import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? 80001 : 137

const setOpenSeaUrl = () =>
	import.meta.env.VITE_ENABLE_TESTNETS === 'true'
		? 'https://testnets.opensea.io/account'
		: 'https://opensea.io/account'

const setRpcUrl = () =>
	import.meta.env.VITE_ENABLE_TESTNETS === 'true'
		? import.meta.env.VITE_POLYGON_MUMBAI_ALCHEMY_RPC_URL
		: import.meta.env.VITE_POLYGON_MAINNET_ALCHEMY_RPC_URL

export const setNetworkMessage = () => {
	const network =
		import.meta.env.VITE_ENABLE_TESTNETS === 'true' ? 'Mumbai' : 'Polygon'

	return `Please switch to ${network} network`
}

export const CHAIN_ID: number = setChainId()

// export const COMMEMORATIVE_NFT_ADDRESS: string = setCommemorativeNftAddress()

export const NETWORK_CHANGE_MESSAGE: string = setNetworkMessage()

export const FAILED_MINTING_MESSAGE: string = 'Failed to mint NFT'

export const NFT_URI: string =
	'https://crimson-written-woodpecker-490.mypinata.cloud/ipfs/QmcgXCzfo3RShJDv9BfbKdP4TsGBcG6qm41XCKmG33MQSf'

export const NFT_IMG: string =
	'https://crimson-written-woodpecker-490.mypinata.cloud/ipfs/QmQqbyn2YUkDSwRSrGTSHiSckh7TRKedeHCdbrACGkv2ea'

export const OPENSEA_URL: string = setOpenSeaUrl()

export const POLYGON_MUMBAI_CUADRATIC_SCIENCE_SUBGRAPH_URL: string =
	'https://api.studio.thegraph.com/query/58173/cuadratic-science/v0.0.1'

export const PRIVATE_KEY: string = import.meta.env.VITE_PRIVATE_KEY as string

export const PROJECT_ID: string = import.meta.env
	.VITE_WALLET_CONNECT_KEY as string

export const RPC_URL: string = setRpcUrl() as string

export const SIGNATURE_MESSAGE: string = 'Sync Hub wants to gift you a NFT!'

export const SUBGRAPH_URL_ERROR_MESSAGE: string = 'Subgraph URL is required.'

export const SUCCESSFUL_MINTING_MESSAGE: string = '🦄 Minted successfully'
