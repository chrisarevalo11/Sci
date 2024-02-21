import { Metadata } from './metadata.model'

export interface Profile {
	id: string
	nonce: string
	name: string
	metadata: Metadata
	owner: string
	anchor: string
}
