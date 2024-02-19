import { FProfile, FProfileDto } from '@/models/profile.model'
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'

interface InitialState {
	myProfile: FProfile
	myProfileDto: FProfileDto
	profile: FProfile
	profileDto: FProfileDto
	profileFetched: boolean
	profiles: FProfileDto[]
	profilesFetched: boolean
}

const initialState: InitialState = {
	myProfile: {
		id: '',
		nonce: -1,
		name: '',
		metadata: { protocol: -1, pointer: '' },
		owner: '',
		anchor: ''
	},
	myProfileDto: {
		id: '',
		name: '',
		nonce: -1,
		metadata: {
			banner: '',
			logo: '',
			slogan: '',
			website: '',
			handle: '',
			description: '',
			members: []
		},
		owner: '',
		anchor: ''
	},
	profile: {
		id: '',
		nonce: -1,
		name: '',
		metadata: { protocol: -1, pointer: '' },
		owner: '',
		anchor: ''
	},
	profileDto: {
		id: '',
		name: '',
		nonce: -1,
		metadata: {
			banner: '',
			logo: '',
			slogan: '',
			website: '',
			handle: '',
			description: '',
			members: []
		},
		owner: '',
		anchor: ''
	},
	profileFetched: false,
	profiles: [],
	profilesFetched: false
}

export const profileSlice: Slice<InitialState> = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		destroyProfile: state => {
			state.myProfile = initialState.myProfile
			state.myProfileDto = initialState.myProfileDto
			state.profile = initialState.profile
			state.profileDto = initialState.profileDto
			state.profileFetched = initialState.profileFetched
			state.profiles = initialState.profiles
			state.profilesFetched = initialState.profilesFetched
		},
		setMyProfile: (state, action: PayloadAction<FProfile>) => {
			state.myProfile = action.payload
		},
		setMyProfileDto: (state, action: PayloadAction<FProfileDto>) => {
			state.myProfileDto = action.payload
		},
		setMyProfileFetched: (state, action: PayloadAction<boolean>) => {
			state.profileFetched = action.payload
		},
		setProfile: (state, action: PayloadAction<FProfile>) => {
			state.profile = action.payload
		},
		setProfileDto: (state, action: PayloadAction<FProfileDto>) => {
			state.profileDto = action.payload
		},
		setProfiles: (state, action: PayloadAction<FProfileDto[]>) => {
			state.profiles = action.payload
		},
		setProfilesFetched: (state, action: PayloadAction<boolean>) => {
			state.profilesFetched = action.payload
		}
	}
})

export const {
	destroyProfile,
	setMyProfile,
	setMyProfileFetched,
	setMyProfileDto,
	setProfile,
	setProfileDto,
	setProfiles,
	setProfilesFetched
} = profileSlice.actions
export default profileSlice.reducer
