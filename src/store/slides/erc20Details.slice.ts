import { ERC20Details } from '@/models/ERC20Details.model'
import { Round } from '@/models/round.model'
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

interface InitialState {
	erc20Details: ERC20Details
	erc20DetailsFetched: boolean
}

const initialState: InitialState = {
	erc20Details: {
		balance: 0,
		allowance: 0
	},
	erc20DetailsFetched: false
}

export const erc20DetailsSlice: Slice<InitialState> = createSlice({
	name: 'erc20Details',
	initialState,
	reducers: {
		destroyERC20Details: state => {
			state.erc20Details = initialState.erc20Details
			state.erc20DetailsFetched = initialState.erc20DetailsFetched
		},
		setERC20Details: (state, action: PayloadAction<ERC20Details>) => {
			state.erc20Details = action.payload
		},
		setERC20DetailsFetched: (state, action: PayloadAction<boolean>) => {
			state.erc20DetailsFetched = action.payload
		}
	}
})

export const { destroyERC20Details, setERC20Details, setERC20DetailsFetched } =
	erc20DetailsSlice.actions

export default erc20DetailsSlice.reducer
