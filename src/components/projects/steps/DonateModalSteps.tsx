import { useState } from 'react'

import Donation from '@/components/projects/steps/Donation'
import Votation from '@/components/projects/steps/Votation'
import { Project } from '@/models/project.model'
import { Round } from '@/models/round.model'

type Props = {
	round: Round
	project: Project
}

export default function Stepper(props: Props): JSX.Element {
	const { round, project } = props
	const [currentStep, setCurrentStep] = useState(0)
	const stepsCount = [0, 1]

	const stepContent: JSX.Element[] = [
		<Donation
			setCurrentStep={setCurrentStep}
			key={0}
			round={round}
			project={project}
		/>,
		<Votation key={1} />
	]

	return (
		<>
			<div className='w-[200px] mx-auto px-4 sm:px-0 mb-2'>
				<ul aria-label='Steps' className='flex items-center'>
					{stepsCount.map((_, index) => (
						<li
							key={index}
							aria-current={currentStep === index ? 'step' : false}
							className='flex-1 last:flex-none flex items-center'
						>
							<div className='flex flex-col items-center'>
								<div
									className={`size-8 rounded-full border-2  flex-none flex items-center justify-center ${
										currentStep >= index
											? 'bg-customGreen text-white border-customGreen'
											: 'border-gray-300'
									}`}
								>
									<span className={'font-bold'}>{index + 1}</span>
								</div>
							</div>
							<hr
								className={`w-[90%] mx-auto border  ${
									index === stepsCount.length - 1
										? 'hidden'
										: '' || currentStep >= index
											? 'border-customGreen'
											: 'border-gray-300'
								}`}
							/>
						</li>
					))}
				</ul>
			</div>
			<div className='mx-auto'>{stepContent[currentStep]}</div>
		</>
	)
}
