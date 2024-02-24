import { ethers } from 'ethers'

import { getFrontendSigner } from '@/helpers'
import { getContracts } from '@/helpers/contracts'
import { ERC20Details } from '@/models/ERC20Details.model'
import { toDecimal, toNumber } from '@/utils'
import {
	ALLO_CONTRACT_ADDRESS,
	ERROR_MESSAGE
} from '@/utils/variables/constants'
import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	setERC20Details,
	setERC20DetailsFetched
} from '../slides/erc20Details.slice'
import { RootState, useAppSelector } from '..'

export const getERC20Details = createAsyncThunk(
	'erc20Details/getERC20Details',
	async (address: string, { dispatch }) => {
		try {
			const { daiMock } = getContracts()

			const balance: bigint = await daiMock.balanceOf(address)
			const balanceNumber = toNumber(balance)

			const allowance: bigint = await daiMock.allowance(
				address,
				ALLO_CONTRACT_ADDRESS
			)
			const allowanceNumber = toNumber(allowance)

			const erc20Details: ERC20Details = {
				balance: balanceNumber,
				allowance: allowanceNumber
			}

			dispatch(setERC20Details(erc20Details))
			dispatch(setERC20DetailsFetched(true))
		} catch (error) {
			console.error('❌ ', error)
			alert(ERROR_MESSAGE)
		}
	}
)

export const mintERC20 = createAsyncThunk(
	'erc20Details/mintERC20',
	async (amount: number, { dispatch, getState }) => {
		try {
			dispatch(setERC20DetailsFetched(false))
			const web3Signer: ethers.JsonRpcSigner = await getFrontendSigner()
			const { daiMock } = getContracts()

			const state = getState() as RootState
			const erc20Details: ERC20Details = state.erc20Details.erc20Details

			const amountBigint: bigint = toDecimal(amount)

			const mintTx = await daiMock.connect(web3Signer).mint(amountBigint)
			await mintTx.wait()

			const updatedErc20Details: ERC20Details = {
				...erc20Details,
				balance: erc20Details.balance + amount
			}

			dispatch(setERC20Details(updatedErc20Details))
			dispatch(setERC20DetailsFetched(true))
		} catch (error) {
			console.error('❌ ', error)
			alert(ERROR_MESSAGE)
			dispatch(setERC20DetailsFetched(true))
		}
	}
)
