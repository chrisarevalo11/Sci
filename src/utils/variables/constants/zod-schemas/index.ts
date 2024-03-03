import { z } from 'zod'

export const donateFormSchema = z.object({
	amount: z.string().min(1, { message: 'Amount is required' })
})

export const createRoundFormSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	banner: z.string().min(1, { message: 'Banner is required' }),
	amount: z.string().min(1, { message: 'Amount is required' }),
	registrationBegin: z
		.string()
		.min(1, { message: 'Registration begin is required' }),
	registrationDeadline: z
		.string()
		.min(1, { message: 'Registration deadline is required' }),
	allocationBegin: z
		.string()
		.min(1, { message: 'Allocation begin is required' }),
	allocationDeadline: z
		.string()
		.min(1, { message: 'Allocation deadline is required' })
})

export const createProjectFormSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }),
	slogan: z.string().min(1, { message: 'Slogan is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	banner: z.string().min(1, { message: 'Banner is required' }),
	logo: z.string().min(1, { message: 'Logo is required' }),
	twitter: z
		.string()
		.min(1, { message: 'Twitter is required' })
		.refine(value => !/\s/.test(value), {
			message: 'Twitter cannot contain spaces'
		}),
	github: z.string().url({ message: 'It should be a url' }),
	website: z
		.string()
		.min(1, { message: 'Website is required' })
		.url({ message: 'Website should be a url' }),
	tags: z.string().refine(
		value => {
			const regex = /^(\w+(,\s*\w+)*)?$/
			const tagsArray = value.split(',').map(tag => tag.trim())
			return regex.test(value) && tagsArray.length <= 5
		},
		{
			message: 'Tags must be word(s) separated by commas and max. 5 tags'
		}
	)
})
