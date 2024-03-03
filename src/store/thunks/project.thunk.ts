import { BytesLike, ethers, ZeroAddress } from 'ethers'
import { NavigateFunction } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getFrontendSigner } from '@/helpers'
import { getContracts } from '@/helpers/contracts'
import { storeObject } from '@/helpers/pinata'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { RecipientData } from '@/models/recipient-data.model'
import { Round } from '@/models/round.model'
import { toAbiCoder } from '@/utils'
import {
	ERROR_MESSAGE,
	GAS_LIMIT,
	RECIPIENT_DATA_STRUCT_TYPES
} from '@/utils/variables/constants'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { setRound } from '../slides/roundslice'
import { setIsLoading } from '../slides/uiSlice'
import { RootState } from '..'

export const createProject = createAsyncThunk(
	'project/createProject',
	async (
		{
			address,
			navigate,
			project
		}: {
			address: string
			navigate: NavigateFunction
			project: Project
		},
		{ dispatch, getState }
	) => {
		try {
			const { allo } = getContracts()
			const { updateRound } = roundsApiFirebase()

			dispatch(setIsLoading(true))
			const web3Signer: ethers.JsonRpcSigner = await getFrontendSigner()

			const state = getState() as RootState
			const round: Round = state.round.lastRound

			// const ipfsUrl: string = await storeObject(round)

			const recipientDataObject: RecipientData = {
				recipientId: address,
				recipientAddress: ZeroAddress,
				metadata: {
					protocol: BigInt(1),
					pointer: 'ipfs://QmQmQmQmQmQmQmQmQmQmQmQmQm'
				}
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const recipientDataArray: any[] = [
				recipientDataObject.recipientId,
				recipientDataObject.recipientAddress,
				[
					recipientDataObject.metadata.protocol,
					recipientDataObject.metadata.pointer
				]
			]

			const recipientData: BytesLike = toAbiCoder(
				RECIPIENT_DATA_STRUCT_TYPES,
				recipientDataArray
			)

			// const registerRecipientTx = await allo
			// 	.connect(web3Signer)
			// 	.registerRecipient(round.poolId, recipientData, { gasLimit: GAS_LIMIT })
			// await registerRecipientTx.wait()

			const updatedProjects = [...round.projects, project]
			const updatedRound: Round = { ...round, projects: updatedProjects }
			await updateRound(updatedRound)

			dispatch(setRound(updatedRound))
			dispatch(setIsLoading(false))
			navigate('/app/projects')
			toast.success('Project created')
		} catch (error) {
			console.error('❌ ', error)
			dispatch(setIsLoading(false))
			toast.error(ERROR_MESSAGE)
		}
	}
)
