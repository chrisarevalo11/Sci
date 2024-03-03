import { createAsyncThunk } from '@reduxjs/toolkit'

export const destroyStore = createAsyncThunk(
	'profile/destroyStore',
	async (_, { dispatch }) => {}
)
