import { SUBGRAPH_URL_ERROR_MESSAGE } from '@/constants'
import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject
} from '@apollo/client'

export function getApolloClient(
	url: string
): ApolloClient<NormalizedCacheObject> {
	if (!url) {
		throw new Error(SUBGRAPH_URL_ERROR_MESSAGE)
	}

	return new ApolloClient({
		uri: url,
		cache: new InMemoryCache()
	})
}
