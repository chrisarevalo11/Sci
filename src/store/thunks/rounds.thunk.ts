import { BytesLike, ethers } from 'ethers'

import { getAlloContracts } from '@/functions/allo-instance.functions'
import { setRecipientFetched } from '@/store/slides/recipientSlice'
import { setLoading } from '@/store/slides/uiSlice'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const distributeMilestone = createAsyncThunk(
	'milestone/setMilestones',
	async (
		{
			recipientId,
			poolId,
			providerOrSigner
		}: {
			recipientId: string
			poolId: string
			providerOrSigner: ethers.BrowserProvider | ethers.JsonRpcSigner
		},
		{ dispatch }
	) => {
		try {
			dispatch(setLoading(true))
			const { allo } = getAlloContracts(providerOrSigner)

			const recipientIds: string[] = [recipientId]
			const bytes: BytesLike = ethers.encodeBytes32String('')

			const distributeMilestoneTx = await allo.distribute(
				poolId,
				recipientIds,
				bytes,
				{
					gasLimit: 6000000
				}
			)

			await distributeMilestoneTx.wait(1)

			dispatch(setRecipientFetched(false))
		} catch (error) {
			alert('Error distributing milestone')
			dispatch(setLoading(false))
			console.error(error)
		}
	}
)
