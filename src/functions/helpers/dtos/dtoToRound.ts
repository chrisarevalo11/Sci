import { convertTimestampToDate } from '@/functions/utils'
import { Round, RoundDto } from '@/models/round.model'

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
