import { Dispatch, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit'

interface InitialState {}

export type AppThunkDispatch = ThunkDispatch<
	InitialState,
	undefined,
	UnknownAction
> &
	Dispatch<UnknownAction>
