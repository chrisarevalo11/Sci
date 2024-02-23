import { getContracts } from '@/helpers/contracts'
import { ERC20Details } from '@/models/ERC20Details.model'
import { toNumber } from '@/utils'
import {
	ALLO_CONTRACT_ADDRESS,
	ERROR_MESSAGE
} from '@/utils/variables/constants'
import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	setERC20Details,
	setERC20DetailsFetched
} from '../slides/erc20Details.slice'

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
