import { useState } from 'react'

export default function Faucet(): JSX.Element {
	const [amount, setAmount] = useState(0)

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite max-w-[500px] p-3 text-center'>
			<h4>Get tokens</h4>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure
				necessitatibus distinctio quisquam veniam saepe minima veritatis aliquid
				fugit officia nihil.
			</p>
			<input
				type='number'
				placeholder='Enter the amount'
				onChange={e => setAmount(parseFloat(e.target.value))}
			/>
			<button
				disabled={amount <= 0 || isNaN(amount)}
				className='btn btn-green mt-3'
				onClick={() => console.log(amount)}
			>
				Get
			</button>
		</div>
	)
}
