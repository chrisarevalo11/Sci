import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavigateFunction } from 'react-router-dom'
import { z } from 'zod'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { AppThunkDispatch } from '@/models/dispatch.model'
import { Project } from '@/models/project.model'
import { createProject } from '@/store/thunks/project.thunk'
import { convertFileToBase64 } from '@/utils'
import { createProjectFormSchema } from '@/utils/variables/constants/zod-schemas'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
	address: string
	dispatch: AppThunkDispatch
	isLoading: boolean
	navigate: NavigateFunction
}

export default function CreateProjectForm(props: Props): JSX.Element {
	const { address, dispatch, isLoading, navigate } = props

	const [banner, setBanner] = useState<string | ArrayBuffer | null>('')
	const [logo, setLogo] = useState<string | ArrayBuffer | null>('')

	const form = useForm<z.infer<typeof createProjectFormSchema>>({
		defaultValues: {
			name: '',
			description: '',
			slogan: '',
			tags: '',
			github: '',
			twitter: '',
			website: '',
			banner: '',
			logo: ''
		},
		resolver: zodResolver(createProjectFormSchema)
	})

	const onCreateProject = async (
		values: z.infer<typeof createProjectFormSchema>
	) => {
		if (!address) return

		const project: Project = {
			banner: banner as string,
			description: values.description,
			github: values.github,
			logo: logo as string,
			name: values.name,
			recipientId: address as string,
			slogan: values.slogan,
			tags: values.tags.split(',').map(tag => tag.trim()),
			twitter: values.twitter,
			website: values.website
		}

		dispatch(createProject({ address: address as string, navigate, project }))
	}

	return (
		<div className='rounded-3xl border-2 mt-10 mx-auto border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] w-fit p-3 lg:p-5 text-center'>
			<h4>New Project</h4>

			<Form {...form}>
				<form
					className='space-y-4 flex flex-col items-center'
					onSubmit={form.handleSubmit(onCreateProject)}
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Project Name</FormLabel>
								<FormControl>
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										placeholder='My project'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='slogan'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Slogan</FormLabel>
								<FormControl>
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										placeholder='Promoting open science'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Description</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										className='w-full'
										disabled={isLoading}
										placeholder='This project is focused on...'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='banner'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Banner</FormLabel>
								<FormControl>
									<input
										{...field}
										accept='image/*'
										autoSave='true'
										className='w-full'
										disabled={isLoading}
										onChange={event => {
											field.onChange(event)
											convertFileToBase64(event, setBanner)
										}}
										type='file'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='logo'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Logo</FormLabel>
								<FormControl>
									<input
										{...field}
										accept='image/*'
										className='w-full'
										disabled={isLoading}
										onChange={event => {
											field.onChange(event)
											convertFileToBase64(event, setLogo)
										}}
										type='file'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='twitter'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>
									Twitter (without @)
								</FormLabel>
								<FormControl>
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										placeholder='myproject'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='github'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Github url</FormLabel>
								<FormControl>
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										placeholder='https://github.com/myproject'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='website'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>
									Website/Linktree
								</FormLabel>
								<FormControl>
									<input
										{...field}
										className='w-full'
										placeholder='https://myproject.com'
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='tags'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Tags</FormLabel>
								<FormControl>
									<input
										{...field}
										className='w-full'
										disabled={isLoading}
										placeholder='tech, biology, etc.'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<button
						type='submit'
						className='btn btn-green !mt-5'
						disabled={isLoading}
					>
						{isLoading ? 'Loading...' : 'Create Project'}
					</button>
				</form>
			</Form>
		</div>
	)
}
