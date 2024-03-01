import CreateProjectForm from '@/components/create/CreateProjectForm'

export default function CreateProject(): JSX.Element {
	return (
		<section className='w-full h-[max(100%, fit-content)] p-4 md:p-10 relative'>
			<header className='flex justify-end pb-3 border-b-4 items-center border-customBlack border-dashed'>
				<h2>Create Project</h2>
			</header>

			<CreateProjectForm />

			<img
				src='/images/slime-no-bg.webp'
				alt='slime'
				className='fixed rotate-180 -z-10 right-[-20px] top-[180px] '
			/>
		</section>
	)
}
