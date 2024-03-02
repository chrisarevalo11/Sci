import { useEffect, useState } from 'react'
import { BytesLike, ethers, ZeroAddress } from 'ethers'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
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
import { getContracts } from '@/helpers/contracts'
import { reviewRecipients } from '@/helpers/relay'
import { roundsApiFirebase } from '@/middlewares/firebase/round.firebase.middleware'
import { Project } from '@/models/project.model'
import { RecipientData } from '@/models/recipient-data.model'
import { Round } from '@/models/round.model'
import { AppDispatch } from '@/store'
import { setRoundFetched, setRoundsFetched } from '@/store/slides/roundslice'
import { toAbiCoder } from '@/utils'
import {
	ERROR_MESSAGE,
	GAS_LIMIT,
	RECIPIENT_DATA_STRUCT_TYPES
} from '@/utils/variables/constants'
import { Status } from '@/utils/variables/enums'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
	// name: z.string().min(1, { message: 'Name is required' }),
	// slogan: z.string().min(1, { message: 'Slogan is required' }),
	// description: z.string().min(1, { message: 'Description is required' }),
	// banner: z.string().min(1, { message: 'Banner is required' }),
	// logo: z.string().min(1, { message: 'Logo is required' }),
	// twitter: z
	// 	.string()
	// 	.min(1, { message: 'Twitter is required' })
	// 	.refine(value => !/\s/.test(value), {
	// 		message: 'Twitter cannot contain spaces'
	// 	}),
	// github: z.string().url({ message: 'It should be a url' }),
	// website: z
	// 	.string()
	// 	.min(1, { message: 'Website is required' })
	// 	.url({ message: 'Website should be a url' }),
	// tags: z.string().refine(
	// 	value => {
	// 		const regex = /^(\w+(,\s*\w+)*)?$/
	// 		const tagsArray = value.split(',').map(tag => tag.trim())
	// 		return regex.test(value) && tagsArray.length <= 5
	// 	},
	// 	{
	// 		message: 'Tags must be word(s) separated by commas and max. 5 tags'
	// 	}
	// )
})

export default function CreateProjectForm(): JSX.Element {
	const { address } = useAccount()
	const navigate = useNavigate()

	const [loading, setLoading] = useState<boolean>(false)
	const [round, setRound] = useState<Round | null>(null)

	const { getLastRound, updateRound } = roundsApiFirebase()
	const { allo } = getContracts()

	const dispatch = useDispatch<AppDispatch>()

	const form = useForm<z.infer<typeof formSchema>>({
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
		resolver: zodResolver(formSchema)
	})

	const getStates = async () => {
		try {
			setLoading(true)
			const lastRound: Round = await getLastRound()
			setRound(lastRound)
			setLoading(false)
		} catch (error) {
			alert('Error: Look at console')
			console.error(error)
			setLoading(false)
		}
	}

	const createProject = async (data: z.infer<typeof formSchema>) => {
		console.log('data: ', data)
		try {
			setLoading(true)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const ethereum = (window as any).ethereum

			if (!ethereum) {
				alert('Ethereum object not found')
				return
			}

			const web3Provider: ethers.BrowserProvider = new ethers.BrowserProvider(
				ethereum
			)
			await web3Provider.send('eth_requestAccounts', [])
			const web3Signer: ethers.JsonRpcSigner = await web3Provider.getSigner()

			const banner: string =
				'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.vox-cdn.com%2Fthumbor%2Fk6HOlMRHUM3ru78xLEFnmUyIwr4%3D%2F0x0%3A800x533%2F1200x800%2Ffilters%3Afocal(0x0%3A800x533)%2Fcdn.vox-cdn.com%2Fuploads%2Fchorus_image%2Fimage%2F30291399%2F800px-thoreaus_quote_near_his_cabin_site__walden_pond.0.jpg&f=1&nofb=1&ipt=8409d0f745c896681625cd32b0f36396463f6cc2b81643dbae6e639ba24b1b2f&ipo=images'
			const description: string =
				'Interpolation of field information with satellite information'
			const github: string = 'www.github.com/recipients'
			const logo: string =
				'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fep01.epimg.net%2Fcultura%2Fimagenes%2F2016%2F09%2F09%2Fbabelia%2F1473420066_993651_1473430939_noticia_normal.jpg&f=1&nofb=1&ipt=65fb6ff7f54bb2df9ed64412dac43ca6f3c9a1921e591cc4eb66e84165793eac&ipo=images'
			const name: string = 'Recipients'
			const slogan: string = 'Gaia is our home'
			const tags: string[] = ['satellite', 'field']
			const twitter: string = 'www.twitter.com/recipients'
			const website: string = 'www.recipients.com'

			if (!address) return

			const recipientDataObject: RecipientData = {
				recipientId: address,
				recipientAddress: ZeroAddress,
				metadata: {
					protocol: BigInt(1),
					pointer: 'ipfs://QmQmQmQmQmQmQmQmQmQmQmQmQm'
				}
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const recipientDataArray: any[] = [
				recipientDataObject.recipientId,
				recipientDataObject.recipientAddress,
				[
					recipientDataObject.metadata.protocol,
					recipientDataObject.metadata.pointer
				]
			]

			const recipientData: BytesLike = toAbiCoder(
				RECIPIENT_DATA_STRUCT_TYPES,
				recipientDataArray
			)

			if (!round) return
			if (!address) return

			const registerRecipientTx = await allo
				.connect(web3Signer)
				.registerRecipient(round.poolId, recipientData, { gasLimit: GAS_LIMIT })

			await registerRecipientTx.wait()

			const reviewRecipientsResponse: string = await reviewRecipients(
				round.address,
				[address],
				[Status.InReview]
			)

			console.log('reviewRecipientsResponse: ', reviewRecipientsResponse)

			const project: Project = {
				banner,
				description,
				github,
				logo,
				name,
				recipientId: address,
				slogan,
				tags,
				twitter,
				website
			}

			if (!round.projects) {
				round.projects = []
			}

			round.projects.push(project)
			console.log('round', round)
			await updateRound(round)

			dispatch(setRoundsFetched(false))
			dispatch(setRoundFetched(false))

			setLoading(false)
			toast.success('Project created')
			form.reset()
			navigate('/app/projects')
		} catch (error) {
			console.error(error)
			toast.error(ERROR_MESSAGE)
			setLoading(false)
		}
	}

	useEffect(() => {
		if (address) {
			;(async () => {
				await getStates()
			})()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className='rounded-3xl border-2 mt-10 mx-auto border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] w-fit p-3 lg:p-5 text-center'>
			<h4>New Project</h4>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(createProject)}
					className='space-y-4 flex flex-col items-center'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem className='flex flex-col items-start w-full'>
								<FormLabel className='mr-2 font-bold'>Project Name</FormLabel>
								<FormControl>
									<input
										className='w-full'
										placeholder='My project'
										{...field}
										disabled={loading}
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
										placeholder='Promoting open science'
										disabled={loading}
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
										placeholder='This project is focused on...'
										className='w-full'
										disabled={loading}
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
										type='file'
										accept='image/*'
										autoSave='true'
										className='w-full'
										{...field}
										disabled={loading}
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
										type='file'
										accept='image/*'
										className='w-full'
										{...field}
										disabled={loading}
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
										placeholder='myproject'
										disabled={loading}
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
										placeholder='https://github.com/myproject'
										disabled={loading}
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
										disabled={loading}
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
										placeholder='tech, biology, etc.'
										disabled={loading}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<button
						type='submit'
						className='btn btn-green !mt-5'
						disabled={loading}
					>
						{loading ? 'Loading...' : 'Create Project'}
					</button>
				</form>
			</Form>
		</div>
	)
}
