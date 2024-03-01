import { useDispatch } from 'react-redux'

import { AppDispatch } from '@/store'
import { approveERC20 } from '@/store/thunks/erc20details.thunk'

type Props = {
	erc20DetailsFetched: boolean
}

export default function ApproveCard(props: Props): JSX.Element {
	const { erc20DetailsFetched } = props
	const dispatch = useDispatch<AppDispatch>()

	const onApprove = async () => {
		const amount: number = 1000
		dispatch(approveERC20(amount))
	}

	return (
		<div className='rounded-3xl border-2 border-customBlack gap-5 items-center flex flex-col bg-customWhite md:min-w-[400px] max-w-[500px] p-3 text-center'>
			<h4>Approve tokens</h4>
			<p>
				By clicking the button below you will approve the Allo contract (address
				above & below) to move test DAI (the amount you specify) from your
				wallet.
			</p>
			<button
				className='btn btn-green mt-3'
				disabled={!erc20DetailsFetched}
				onClick={onApprove}
			>
				{!erc20DetailsFetched ? 'Loading...' : 'Approve'}
			</button>
		</div>
	)
}
