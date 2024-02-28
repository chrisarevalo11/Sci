import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	banner: z.string().min(1, { message: 'Banner is required' }),
	amount: z.string().min(1, { message: 'Amount is required' }),
	registrationDeadline: z
		.string()
		.min(1, { message: 'Registration deadline is required' }),
	allocationDeadline: z
		.string()
		.min(1, { message: 'Allocation deadline is required' })
})

export default function CreateProjectForm(): JSX.Element {
	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			name: '',
			banner: '',
			amount: '',
			registrationDeadline: '',
			allocationDeadline: ''
		},
		resolver: zodResolver(formSchema)
	})

	const createProject = async (data: z.infer<typeof formSchema>) => {
		setLoading(true)
		console.log(data)
	}

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] max-w-[500px] p-3 text-center'>
			<h4>New Round</h4>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(createProject)}
					className='space-y-4 flex flex-col items-center'
				>
					<div className='flex flex-col items-start w-full'>
						<FormLabel className='mr-2 font-bold mb-2'>Profile Id</FormLabel>
						<FormControl>
							<input
								disabled
								type='text'
								className='w-full opacity-70'
								placeholder='Test'
							/>
						</FormControl>
					</div>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Round Name</FormLabel>
								<FormControl>
									<input
										type='text'
										className='w-full'
										placeholder='My round'
										{...field}
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
									<input type='file' className='w-full' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='amount'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>
									Initial amount (DAI)
								</FormLabel>
								<FormControl>
									<input
										type='number'
										className='w-full'
										placeholder='1880'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='registrationDeadline'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Round Name</FormLabel>
								<FormControl>
									<input type='datetime-local' className='w-full' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='allocationDeadline'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Round Name</FormLabel>
								<FormControl>
									<input type='datetime-local' className='w-full' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<button
						className='btn btn-green !mt-5'
						type='submit'
						disabled={loading}
					>
						{loading ? 'Loading...' : 'Create Round'}
					</button>
				</form>
			</Form>
		</div>
	)
}
