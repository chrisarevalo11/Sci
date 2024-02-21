<<<<<<< HEAD:src/helpers/dtos/dtoToRound.ts
=======
import { convertTimestampToDate } from '@/utils'
>>>>>>> main:src/functions/helpers/dtos/dtoToRound.ts
import { Round, RoundDto } from '@/models/round.model'
import { convertTimestampToDate } from '@/utils/functions'

export function dtoToRound(dto: RoundDto): Round {
	const startDate: string = convertTimestampToDate(dto.startTime)
	const signUpDeadline: string = convertTimestampToDate(dto.signUpDeadline)

	const round: Round = {
		id: dto.id,
		startDate,
		signUpDeadline
	}
	return round
}
