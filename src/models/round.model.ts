import { Project } from './project.model'

export interface Round {
	address: string
	allocationEndTime: number
	allocationStartTime: number
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
	registrationStartTime: number
	registryGating: boolean
	reviewThreshold: number
	totalPool: number
}
