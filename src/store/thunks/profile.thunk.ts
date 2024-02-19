import { ethers } from 'ethers'

import {
	ARBITRUM_DIRECT_GRANTS_SIMPLE_STRATEGY,
	PROFILE_NOT_FOUND
} from '@/constants/constans'
import { getAlloContracts } from '@/functions/allo-functions'
import { getAlloContracts as getAlloInstanceContracts } from '@/functions/allo-instance.functions'
import {
	dtoToProfile,
	fProfileSubmitionToDto,
	fProfileToFprofileDto
} from '@/functions/dtos/profile.dtos'
import {
	FProfile,
	FProfileDto,
	FProfileSubmition
} from '@/models/profile.model'
import { getSubGraphData as getRegistrySubGraphData } from '@/services/register-subgraph.service'
import { Profile } from '@allo-team/allo-v2-sdk/dist/Registry/types'
import { createAsyncThunk } from '@reduxjs/toolkit'

import {
	setMyProfile,
	setMyProfileDto,
	setMyProfileFetched,
	setProfile,
	setProfileDto,
	setProfiles,
	setProfilesFetched
} from '../slides/profileSlice'
import { setLoading } from '../slides/uiSlice'

import { getPools } from './pool.thunk'

const { getProfileIdByOwner, getPaginatedProfiles } = getRegistrySubGraphData()

export const createProfile = createAsyncThunk(
	'profile/createProfile',
	async (
		{
			fProfileSubmition,
			providerOrSigner
		}: {
			fProfileSubmition: FProfileSubmition
			providerOrSigner: ethers.BrowserProvider | ethers.JsonRpcSigner
		},
		{ dispatch }
	) => {
		try {
			dispatch(setLoading(true))
			const { registry } = getAlloInstanceContracts(providerOrSigner)

			const profileSubmitionDto = fProfileSubmitionToDto(fProfileSubmition)
			const createProfileTx = await registry.createProfile(
				profileSubmitionDto.nonce,
				profileSubmitionDto.name,
				profileSubmitionDto.metadata,
				profileSubmitionDto.owner,
				profileSubmitionDto.members
			)

			await createProfileTx.wait(1)

			dispatch(setMyProfileFetched(false))
			dispatch(setProfilesFetched(false))
			alert('Profile created successfully')
			dispatch(setLoading(false))
		} catch (error) {
			dispatch(setLoading(false))
		}
	}
)

export const getMyProfile = createAsyncThunk(
	'profile/getMyProfile',
	async (address: string, { dispatch }) => {
		dispatch(setLoading(true))
		const { registry } = getAlloContracts()

		const profileId: string = await getProfileIdByOwner(address)

		if (profileId === PROFILE_NOT_FOUND) {
			dispatch(setMyProfileFetched(true))
			dispatch(setLoading(false))
			return
		}

		const profileDto: Profile = await registry.getProfileById(profileId)
		const profile: FProfile = dtoToProfile(profileDto)
		const fprofileDto: FProfileDto = await fProfileToFprofileDto(profile)

		dispatch(setMyProfile(profile))
		dispatch(setMyProfileDto(fprofileDto))

		dispatch(
			getPools({
				first: 8,
				skip: 0,
				strategy: ARBITRUM_DIRECT_GRANTS_SIMPLE_STRATEGY
			})
		)

		dispatch(setMyProfileFetched(true))
		dispatch(setLoading(false))
	}
)

export const getProfile = createAsyncThunk(
	'profile/getProfile',
	async (address: string, { dispatch }) => {
		dispatch(setLoading(true))
		const { registry } = getAlloContracts()

		const profileId: string = await getProfileIdByOwner(address)

		if (profileId === PROFILE_NOT_FOUND) {
			dispatch(setLoading(false))
			return
		}

		const profileDto: Profile = await registry.getProfileById(profileId)
		const profile: FProfile = dtoToProfile(profileDto)
		const fprofileDto: FProfileDto = await fProfileToFprofileDto(profile)

		dispatch(setProfile(profile))
		dispatch(setProfileDto(fprofileDto))

		dispatch(
			getPools({
				first: 8,
				skip: 0,
				strategy: ARBITRUM_DIRECT_GRANTS_SIMPLE_STRATEGY
			})
		)

		dispatch(setLoading(false))
	}
)

export const getProfiles = createAsyncThunk(
	'profile/getPaginatedProfiles',
	async ({ first, skip }: { first: number; skip: number }, { dispatch }) => {
		dispatch(setLoading(true))

		const profiles: FProfile[] | string = await getPaginatedProfiles(
			first,
			skip
		)

		if (typeof profiles === 'string') {
			dispatch(setProfilesFetched(true))
			dispatch(setLoading(false))
			return
		}

		const profilesDto = await Promise.all(
			profiles.map(async (profile: FProfile) => {
				return await fProfileToFprofileDto(profile)
			})
		)

		dispatch(setProfiles(profilesDto))
		dispatch(setProfilesFetched(true))
		dispatch(setLoading(false))
	}
)
