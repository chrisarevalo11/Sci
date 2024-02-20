import { addDoc, collection, getDocs } from 'firebase/firestore'

import { database } from '@/config/firebase.config.js'
import { Round } from '@/models/round.model'
import { FIREBASE_COLLECTION_ROUNDS } from '@/utils/variables/constants'

export function roundsApiFirebase() {
	const roundsCollectionRef = collection(database, FIREBASE_COLLECTION_ROUNDS)

	const addRound = async (round: Round) => {
		try {
			const docRef = await addDoc(roundsCollectionRef, round)
			console.log('Round added with ID: ', docRef.id)
		} catch (error) {
			console.error('Error adding profile: ', error)
		}
	}

	const getRoundsLength = async (): Promise<number> => {
		try {
			const item = await getDocs(roundsCollectionRef)
			return item.docs.length
		} catch (error) {
			console.error('Error getting strategies length: ', error)
			return 0
		}
	}

	const getLastRound = async (): Promise<Round> => {
		try {
			const item = await getDocs(roundsCollectionRef)
			return item.docs[item.docs.length - 1].data() as Round
		} catch (error) {
			console.error('Error getting last round: ', error)
			return {} as Round
		}
	}

	return {
		addRound,
		getLastRound,
		getRoundsLength
	}
}
