import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'

import { database } from '@/config/firebase.config.js'
import { Profile } from '@/models/profile.model'
import { FIREBASE_COLLECTION_PROFILES } from '@/utils/variables/constants'

export function profilesApiFirebase() {
	const profilesCollectionRef = collection(
		database,
		FIREBASE_COLLECTION_PROFILES
	)

	const addProfile = async (profile: Profile) => {
		try {
			const docRef = await addDoc(profilesCollectionRef, profile)
			console.log('Profile added with ID: ', docRef.id)
		} catch (e) {
			console.error('Error adding profile: ', e)
		}
	}

	const getProfileByAddress = async (address: string): Promise<Profile> => {
		const item = await getDocs(
			query(profilesCollectionRef, where('owner', '==', address))
		)

		if (item.docs.length === 0) {
			console.log(`No profile with ownerAddress "${address}" found`)
			// return {} as Profile
		}

		return item.docs[0].data() as Profile
	}

	// const getTicketsByOwner = async (address: string): Promise<any[]> => {
	// 	const item = await getDocs(
	// 		query(leafsCollectionRef, where('owner', '==', address))
	// 	)

	// 	if (item.docs.length === 0) {
	// 		console.log(`No projects with ownerAddress "${address}" found`)
	// 		return []
	// 	}

	// 	return item.docs.map(
	// 		doc => ({ id: doc.id, ...doc.data() }) as unknown as any
	// 	)
	// }

	// const updateTicket = async (ticketId: string, ticket: any) => {
	// 	return await addDoc(leafsCollectionRef, ticket)
	// }

	return {
		addProfile,
		getProfileByAddress
	}
}
