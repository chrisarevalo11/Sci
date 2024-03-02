import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Round } from '@/models/round.model'
import { ERROR_MESSAGE } from '@/utils/variables/constants'
import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	setRound,
	setRoundFetched,
	setRounds,
	setRoundsFetched
} from '../slides/roundslice'

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

export const getLastRound = createAsyncThunk(
	'round/getLastRound',
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

export const getRound = createAsyncThunk(
	'round/getRound',
	async ({ id }: { id: number }, { dispatch }) => {
		try {
			dispatch(setRoundFetched(false))
			const { getRoundById } = roundsApiFirebase()

			const round: Round = await getRoundById(id)

			dispatch(setRound(round))
			dispatch(setRoundFetched(true))
		} catch (error) {
			console.error('❌ ', error)
			alert(ERROR_MESSAGE)
			dispatch(setRoundFetched(true))
		}
	}
)

export const getRounds = createAsyncThunk(
	'round/getRounds',
	async (_, { dispatch }) => {
		try {
			const { getRounds } = roundsApiFirebase()

			const rounds: Round[] = await getRounds()

			dispatch(setRounds(rounds))
			dispatch(setRoundsFetched(true))
		} catch (error) {
			console.error('❌ ', error)
			alert(ERROR_MESSAGE)
			dispatch(setRoundFetched(true))
		}
	}
)
