import {
	addDoc,
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	updateDoc,
	where
} from 'firebase/firestore'

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

	const getRoundById = async (id: number): Promise<Round> => {
		try {
			const querySnapshot = await getDocs(
				query(roundsCollectionRef, where('id', '==', id))
			)
			if (!querySnapshot.empty) {
				return querySnapshot.docs[0].data() as Round
			} else {
				console.log('No round found with the given ID')
				return {} as Round
			}
		} catch (error) {
			console.error('Error getting round: ', error)
			return {} as Round
		}
	}

	const getRounds = async (): Promise<Round[]> => {
		try {
			const querySnapshot = await getDocs(roundsCollectionRef)
			const rounds: Round[] = []
			querySnapshot.forEach(doc => {
				rounds.push(doc.data() as Round)
			})
			return rounds
		} catch (error) {
			console.error('Error getting rounds: ', error)
			return []
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

	const updateRound = async (updatedRound: Partial<Round>) => {
		try {
			const q = query(roundsCollectionRef, where('id', '==', updatedRound.id))
			const querySnapshot = await getDocs(q)

			if (!querySnapshot.empty) {
				const docRef = querySnapshot.docs[0].ref
				await updateDoc(docRef, updatedRound)
				console.log(`Round with ID: ${updatedRound.id} updated successfully`)
			} else {
				console.log('No round found with the given ID')
			}
		} catch (error) {
			console.error('Error updating round: ', error)
		}
	}

	return {
		addRound,
		getRoundById,
		getLastRound,
		getRounds,
		getRoundsLength,
		updateRound
	}
}
