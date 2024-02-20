import { useState } from 'react'

export default function Approve(): JSX.Element {
	const [address, setAddress] = useState('')
	const [amount, setAmount] = useState(0)

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite max-w-[500px] p-3 text-center'>
			<h4>Approve tokens</h4>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
				necessitatibus distinctio quisquam veniam saepe minima veritatis aliquid
				fugit officia nihil.
			</p>
			<input
				type='text'
				placeholder='Approved address'
				onChange={e => setAddress(e.target.value)}
			/>
			<input
				type='number'
				placeholder='Approved amount'
				onChange={e => setAmount(parseFloat(e.target.value))}
			/>
			<button
				disabled={amount <= 0 || isNaN(amount) || !address}
				className='btn btn-green mt-3'
				onClick={() => console.log(amount, address)}
			>
				Approve
			</button>
		</div>
	)
}
