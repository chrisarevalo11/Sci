import {
	addDoc,
	collection,
	getDocs,
	limit,
	orderBy,
	query
} from 'firebase/firestore'

import { database } from '@/config/firebase.config.js'
import { Project } from '@/models/project.model'
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
			const querySnapshot = await getDocs(
				query(roundsCollectionRef, orderBy('id', 'desc'), limit(1))
			)
			if (!querySnapshot.empty) {
				return querySnapshot.docs[0].data() as Round
			} else {
				console.log('No rounds found')
				return {} as Round
			}
		} catch (error) {
			console.error('Error getting last round: ', error)
			return {} as Round
		}
	}

	const updateRound = async (round: Round) => {
		try {
			const docRef = await addDoc(roundsCollectionRef, round)
			console.log('Round updated with ID: ', docRef.id)
		} catch (error) {
			console.error('Error updating round: ', error)
		}
	}

	return {
		addRound,
		getLastRound,
		getRoundsLength,
		updateRound
	}
}
