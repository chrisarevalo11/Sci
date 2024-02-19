import { ethers } from 'ethers'

import { getAlloContracts as getAlloInstanceContracts } from '@/functions/allo-instance.functions'
import { fPoolToFpoolDto } from '@/functions/dtos/pool.dtos'
import { FPool, FPoolSubmition } from '@/models/pool.model'
import { getSubGraphData } from '@/services/allo-subgraph.service'
import { createAsyncThunk } from '@reduxjs/toolkit'

import { setPoolsDto, setPoolsFetched } from '../slides/poolSlice'
import { setMyProfileFetched } from '../slides/profileSlice'
import { setLoading } from '../slides/uiSlice'

const { getPaginatedPoolsByStrategy } = getSubGraphData()

export const createPool = createAsyncThunk(
	'pool/createPool',
	async (
		{
			fPoolSubmition,
			providerOrSigner
		}: {
			fPoolSubmition: FPoolSubmition
			providerOrSigner: ethers.BrowserProvider | ethers.JsonRpcSigner
		},
		{ dispatch }
	) => {
		try {
			dispatch(setLoading(true))
			const { allo } = getAlloInstanceContracts(providerOrSigner)

			const createPoolTx = await allo.createPoolWithCustomStrategy(
				fPoolSubmition.profileId,
				fPoolSubmition.strategy,
				fPoolSubmition.initStrategyData,
				fPoolSubmition.token,
				fPoolSubmition.amount,
				fPoolSubmition.metadata,
				fPoolSubmition.managers,
				{
					value: fPoolSubmition.amount,
					gasLimit: 6000000
				}
			)

			await createPoolTx.wait(1)

			setTimeout(() => {
				alert('Pool created!')
				dispatch(setMyProfileFetched(false))
				dispatch(setLoading(false))
			}, 3000)
		} catch (error) {
			dispatch(setLoading(false))
			alert('Error creating pool!')
			console.error(error)
		}
	}
)

export const getPools = createAsyncThunk(
	'pools/getPaginatedPools',
	async (
		{
			first,
			skip,
			strategy
		}: { first: number; skip: number; strategy: string },
		{ dispatch }
	) => {
		dispatch(setLoading(true))

		const pools = await getPaginatedPoolsByStrategy(first, skip, strategy)

		if (typeof pools === 'string') {
			dispatch(setPoolsFetched(true))
			dispatch(setLoading(false))
			return
		}

		const poolsDto = await Promise.all(
			pools.map(async (pool: FPool) => {
				return await fPoolToFpoolDto(pool)
			})
		)

		dispatch(setPoolsDto(poolsDto))
		dispatch(setPoolsFetched(true))
		dispatch(setLoading(false))
	}
)
