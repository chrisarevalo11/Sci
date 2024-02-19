export const queryPaginatedRounds = `
    query FundingRounds($first: Int!, $skip: Int!) {
      fundingRounds(orderBy: createdAt, orderDirection: desc, first: $first, skip: $skip) {
        id
        startTime
        signUpDeadline
      }
    }
  `
