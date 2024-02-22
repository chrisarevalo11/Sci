import Github from '@/components/icons/Github'
import Globe from '@/components/icons/Globe'
import Container from '@/components/ui/Container'

export default function Footer(): JSX.Element {
	return (
		<footer className='text-customBlack'>
			<Container className='my-20 flex md:flex-row flex-col text-center md:text-left gap-5 md:justify-between items-center'>
				<div className='space-y-1'>
					<h2>Crowdfunding science</h2>
					<h3>
						by <span className='text-customGreen'>Sync Hub</span>
					</h3>
				</div>
				<div className='flex gap-3'>
					<a
						href='https://github.com/salviega/cuadratic-sciencie-bnb-frontend'
						target='_blank'
						rel='noopener noreferrer'
					>
						<Github className='size-10' />
					</a>
					<a
						href='https://www.synchub.site/'
						target='_blank'
						rel='noopener noreferrer'
					>
						<Globe className='size-10' />
					</a>
				</div>
			</Container>
		</footer>
	)
}
