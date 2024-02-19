import { FPool, FPoolDto } from '@/models/pool.model'
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

interface InitialState {
	poolFetched: boolean
	pools: FPool[]
	poolsDto: FPoolDto[]
	poolsFetched: boolean
}

const initialState: InitialState = {
	poolFetched: false,
	pools: [],
	poolsDto: [],
	poolsFetched: false
}

export const poolSlice: Slice<InitialState> = createSlice({
	name: 'pool',
	initialState,
	reducers: {
		destroyPools: state => {
			state.poolFetched = false
			state.pools = []
			state.poolsDto = []
			state.poolsFetched = false
		},
		setPoolFetched: (state, action: PayloadAction<boolean>) => {
			state.poolFetched = action.payload
		},
		setPools: (state, action: PayloadAction<FPool[]>) => {
			state.pools = action.payload
		},
		setPoolsDto: (state, action: PayloadAction<FPoolDto[]>) => {
			state.poolsDto = action.payload
		},
		setPoolsFetched: (state, action: PayloadAction<boolean>) => {
			state.poolFetched = action.payload
		}
	}
})

export const {
	destroyPools,
	setPoolFetched,
	setPools,
	setPoolsDto,
	setPoolsFetched
} = poolSlice.actions
export default poolSlice.reducer
