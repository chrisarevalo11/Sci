import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Round } from '@/models/round.model'
import { convertTimestampToDate } from '@/utils'
import { ERROR_MESSAGE } from '@/utils/variables/constants'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { setRound, setRoundFetched } from '../slides/roundslice'

export const createRound = createAsyncThunk(
	'round/createRound',
	async (_, { dispatch }) => {
		try {
			console.log('TODO: createRound')
		} catch (error) {
			console.error('❌ ', error)
			alert(ERROR_MESSAGE)
			dispatch(setRoundFetched(true))
		}
	}
)

export const getRound = createAsyncThunk(
	'round/getRound',
	async (_, { dispatch }) => {
		try {
			const { getLastRound } = roundsApiFirebase()

			const lastRound: Round = await getLastRound()

			dispatch(setRound(lastRound))
			dispatch(setRoundFetched(true))
		} catch (error) {
			console.error('❌ ', error)
			alert(ERROR_MESSAGE)
			dispatch(setRoundFetched(true))
		}
	}
)
