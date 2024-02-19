import { createAsyncThunk } from '@reduxjs/toolkit'

import { destroyPools } from '../slides/poolSlice'
import { destroyProfile } from '../slides/profileSlice'

export const destroyStore = createAsyncThunk(
	'profile/destroyStore',
	async (_, { dispatch }) => {
		dispatch(destroyProfile(''))
		dispatch(destroyPools(''))
	}
)
