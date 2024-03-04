import { getContracts } from '@/helpers/contracts'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'
import { toNumber } from '@/utils'
import { ERROR_MESSAGE, ROUND_ADDRESS } from '@/utils/variables/constants'
import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	setRound,
	setRoundFetched,
	setRounds,
	setRoundsFetched
} from '../slides/roundslice'
import { setIsLoading } from '../slides/uiSlice'

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
			const { qVSimpleStrategy } = getContracts()
			const { getLastRound } = roundsApiFirebase()

			dispatch(setIsLoading(true))
			const lastRound: Round = await getLastRound()

			if (lastRound.distributed) {
				const updatedProjects = await Promise.all(
					lastRound.projects.map(async (project: Project) => {
						const recipientData = await qVSimpleStrategy(
							ROUND_ADDRESS
						).getRecipient(project?.recipientId)
						const amountDistributed = toNumber(recipientData[6])
						return { ...project, amountDistributed }
					})
				)

				lastRound.projects = updatedProjects
			}

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
			dispatch(setRoundsFetched(true))
		}
	}
)
