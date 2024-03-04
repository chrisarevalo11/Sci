export interface Project {
	amountDistributed: number
	banner: string
	description: string
	github: string
	logo: string
	name: string
	recipientId: string
	slogan: string
	tags: string[]
	twitter: string
	website: string
}

export interface ProjectDto {
	amountDistributed: number
	banner: File
	description: string
	github: string
	logo: File
	name: string
	recipientId: string
	slogan: string
	tags: string[]
	twitter: string
	website: string
}
