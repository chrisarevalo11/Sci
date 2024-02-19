import { Steps } from '@/models/ui/steps.model'
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

interface InitialState {
	loading: boolean
	steps: Steps
}

const initialState: InitialState = {
	loading: true,
	steps: {
		count: [0, 1, 2],
		current: 0
	}
}

export const uiSlice: Slice<InitialState> = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload
		},
		setSteps: (state, action: PayloadAction<number>) => {
			state.steps.current = action.payload
		}
	}
})

export const { setLoading, setSteps } = uiSlice.actions
export default uiSlice.reducer
