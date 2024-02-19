import { Recipient } from '@/models/recipient.model'
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

interface InitialState {
	grantee: Recipient
	recipient: Recipient
	recipientFetched: boolean
}

const initialState: InitialState = {
	grantee: {
		grantAmount: 0,
		metadata: {
			bio: '',
			email: '',
			fullname: '',
			image: '',
			organization: ''
		},
		milestonesReviewStatus: 0,
		recipientAddress: '',
		recipientStatus: 0,
		useRegistryAnchor: false
	},
	recipient: {
		grantAmount: 0,
		metadata: {
			bio: '',
			email: '',
			fullname: '',
			image: '',
			organization: ''
		},
		milestonesReviewStatus: 0,
		recipientAddress: '',
		recipientStatus: 0,
		useRegistryAnchor: false
	},
	recipientFetched: false
}

export const recipientSlice: Slice<InitialState> = createSlice({
	name: 'recipient',
	initialState,
	reducers: {
		destroyRecipient: state => {
			state.grantee = initialState.grantee
			state.recipient = initialState.recipient
			state.recipientFetched = initialState.recipientFetched
		},
		setGrantee: (state, action: PayloadAction<Recipient>) => {
			state.grantee = action.payload
		},
		setRecipient: (state, action: PayloadAction<Recipient>) => {
			state.recipient = action.payload
		},
		setRecipientFetched: (state, action: PayloadAction<boolean>) => {
			state.recipientFetched = action.payload
		}
	}
})

export const {
	destroyRecipient,
	setGrantee,
	setRecipient,
	setRecipientFetched
} = recipientSlice.actions

export default recipientSlice.reducer
