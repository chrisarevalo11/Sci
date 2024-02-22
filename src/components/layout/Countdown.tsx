import { useCountdown } from '@/hooks/useCountdown'

export default function Countdown({
	targetDate
}: {
	targetDate: Date
}): JSX.Element {
	const [days, hours, minutes, seconds] = useCountdown(targetDate)

	return <Timer days={days} hours={hours} minutes={minutes} seconds={seconds} />
}

function Timer(props: {
	days: number
	hours: number
	minutes: number
	seconds: number
}): JSX.Element {
	const { days, hours, minutes, seconds } = props

	return (
		<section className='flex gap-2 font-dela'>
			<div className='flex flex-col items-center justify-center min-w-[30px]'>
				<h5>{days}</h5>
				<p className='text-customGreen'>D</p>
			</div>
			<div className='flex flex-col items-center justify-center min-w-[30px]'>
				<h5>{hours}</h5>
				<p className='text-customGreen'>H</p>
			</div>
			<div className='flex flex-col items-center justify-center min-w-[30px]'>
				<h5>{minutes}</h5>
				<p className='text-customGreen'>M</p>
			</div>
			<div className='flex flex-col items-center justify-center min-w-[30px]'>
				<h5>{seconds}</h5>
				<p className='text-customGreen'>S</p>
			</div>
		</section>
	)
}
