import { Project } from './project.model'

export interface Round {
	address: string
	allocationEndTime: number
	allocationEndTimeDate: Date
	allocationStartTime: number
	allocationStartTimeDate: Date
	distributed: boolean
	donations: number
	donators: string[]
	id: number
	image: string
	machingPool: number
	metadataRequired: boolean
	name: string
	poolId: number
	profileId: string
	projects: Project[]
	registrationEndTime: number
	registrationEndTimeDate: Date
	registrationStartTime: number
	registrationStartTimeDate: Date
	registryGating: boolean
	reviewThreshold: number
	totalPool: number
}
