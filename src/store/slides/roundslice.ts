import { ZeroAddress } from 'ethers'

import { Round } from '@/models/round.model'
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

interface InitialState {
	lastRound: Round
	lastRoundFetched: boolean
	rounds: Round[]
	roundsFetched: boolean
}

const initialState: InitialState = {
	lastRound: {
		address: ZeroAddress,
		allocationEndTime: 0,
		allocationStartTime: 0,
		distributed: false,
		donations: 0,
		donators: [],
		id: 0,
		image: '',
		machingPool: 0,
		metadataRequired: false,
		name: '',
		poolId: 0,
		profileId: '',
		projects: [],
		registrationEndTime: 0,
		registrationStartTime: 0,
		registryGating: false,
		reviewThreshold: 0,
		totalPool: 0
	},
	lastRoundFetched: false,
	rounds: [],
	roundsFetched: false
}

export const roundSlice: Slice<InitialState> = createSlice({
	name: 'round',
	initialState,
	reducers: {
		destroyRound: state => {
			state.lastRound = initialState.lastRound
			state.lastRoundFetched = initialState.lastRoundFetched
		},
		setRound: (state, action: PayloadAction<Round>) => {
			state.lastRound = action.payload
		},
		setRoundFetched: (state, action: PayloadAction<boolean>) => {
			state.lastRoundFetched = action.payload
		},
		setRounds: (state, action: PayloadAction<Round[]>) => {
			state.rounds = action.payload
		},
		setRoundsFetched: (state, action: PayloadAction<boolean>) => {
			state.roundsFetched = action.payload
		}
	}
})

export const {
	destroyRound,
	setRound,
	setRoundFetched,
	setRounds,
	setRoundsFetched
} = roundSlice.actions

export default roundSlice.reducer
