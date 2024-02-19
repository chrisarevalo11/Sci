import { POLYGON_MUMBAI_CUADRATIC_SCIENCE_SUBGRAPH_URL } from '@/constants'
import { dtoToRound } from '@/functions/helpers/dtos/dtoToRound'
import { getApolloClient } from '@/graphql'
import { queryPaginatedRounds } from '@/graphql/queries'
import { Round, RoundDto } from '@/models/round.model'
import { gql } from '@apollo/client'

export function fetchSubGraphData() {
	const client = getApolloClient(POLYGON_MUMBAI_CUADRATIC_SCIENCE_SUBGRAPH_URL)

	const getRounds = async (first: number, skip: number): Promise<Round[]> => {
		try {
			const response = await client.query({
				query: gql(queryPaginatedRounds),
				variables: { first, skip }
			})

			const rounds: Round[] = response.data.fundingRounds.map(
				(roundDto: RoundDto) => dtoToRound(roundDto)
			)

			return rounds
		} catch (error) {
			console.error(`❌: ${error}`)
			return []
		}
	}

	return {
		getRounds
	}
}
