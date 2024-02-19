import { Round } from '@/models/round.model'
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

interface InitialState {
	rounds: Round[]
	roundsFetched: boolean
}

const initialState: InitialState = {
	rounds: [],
	roundsFetched: false
}

export const roundslice: Slice<InitialState> = createSlice({
	name: 'rounds',
	initialState,
	reducers: {
		destroyRounds: state => {
			state.rounds = initialState.rounds
			state.roundsFetched = initialState.roundsFetched
		},
		setRoundsId: (state, action: PayloadAction<Round[]>) => {
			state.rounds = action.payload.map(round => {
				return { ...round, id: round.id }
			})
		},
		setRoundsFetched: (state, action: PayloadAction<boolean>) => {
			state.roundsFetched = action.payload
		}
	}
})

export const { destroyRound, setRoundsId, setRoundsFetched } =
	roundslice.actions

export default roundslice.reducer
