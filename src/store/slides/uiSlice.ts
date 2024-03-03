import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

interface InitialState {
	isLoading: boolean
}

const initialState: InitialState = {
	isLoading: true
}

export const uiSlice: Slice<InitialState> = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload
		}
	}
})

export const { setIsLoading } = uiSlice.actions
export default uiSlice.reducer
