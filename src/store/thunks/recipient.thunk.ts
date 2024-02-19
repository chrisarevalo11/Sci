import { BytesLike, ethers } from 'ethers'

import { getAlloContracts } from '@/functions/allo-instance.functions'
import { convertToAllocateData } from '@/functions/dtos/recipient.dtos'
import { getStrategiesContracts } from '@/functions/strategies/strategies.functions'
import { Milestone } from '@/models/milestone.model'
import { Recipient } from '@/models/recipient.model'
import {
	getMilestonesByRecipientId,
	getRecipientByProfileId
} from '@/services/strategies/direct-grants-simple.service'
import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	setGrantee,
	setRecipient,
	setRecipientFetched
} from '../slides/recipientSlice'
import { setMilestones } from '../slides/roundslice'
import { setLoading, setSteps } from '../slides/uiSlice'

export const addRecipient = createAsyncThunk(
	'recipient/addREcipient',
	async (
		{
			anchor,
			grantAmount,
			frecipientSubmition,
			frecipientDtoWallet,
			poolId,
			providerOrSigner
		}: {
			anchor: string
			grantAmount: number
			frecipientSubmition: BytesLike
			frecipientDtoWallet: string
			poolId: string
			providerOrSigner: ethers.BrowserProvider | ethers.JsonRpcSigner
		},
		{ dispatch }
	) => {
		try {
			dispatch(setLoading(true))
			const { allo } = getAlloContracts(providerOrSigner)
			const { directGrantsSimple } = getStrategiesContracts(providerOrSigner)

			const registerRecipientTx = await allo.registerRecipient(
				poolId,
				frecipientSubmition,
				{
					value: 0,
					gasLimit: 6000000
				}
			)

			await registerRecipientTx.wait(1)
			dispatch(setSteps(1))

			const setRecipientStatusToInReviewTx =
				await directGrantsSimple.setRecipientStatusToInReview([anchor])

			await setRecipientStatusToInReviewTx.wait(1)
			dispatch(setSteps(2))

			const allocateDataBytes: BytesLike = await convertToAllocateData(
				frecipientDtoWallet,
				grantAmount
			)

			const setAllocateTx = await allo.allocate(poolId, allocateDataBytes, {
				value: 0,
				gasLimit: 6000000
			})

			await setAllocateTx.wait(1)

			dispatch(setSteps(3))
			dispatch(setRecipientFetched(false))
			dispatch(setLoading(false))
		} catch (error) {
			alert('Error adding recipient!')
			dispatch(setLoading(false))
			console.error(error)
		}
	}
)

export const getRecipient = createAsyncThunk(
	'recipient/getRecipient',
	async ({ profileId }: { profileId: string }, { dispatch }) => {
		try {
			dispatch(setLoading(true))

			const recipient: Recipient = await getRecipientByProfileId(profileId)
			const grantee: Recipient = await getRecipientByProfileId(
				recipient.recipientAddress
			)
			const milestones: Milestone[] = await getMilestonesByRecipientId(
				recipient.recipientAddress
			)

			dispatch(setRecipient(recipient))
			dispatch(setGrantee(grantee))
			dispatch(setMilestones(milestones))
			dispatch(setRecipientFetched(true))
			dispatch(setLoading(false))
		} catch (error) {
			alert('Error getting recipient')
			dispatch(setLoading(false))
			console.error(error)
		}
	}
)
