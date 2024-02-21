import { useState } from 'react'

type copied = boolean
type copyFn = (text: string) => Promise<boolean>

export function useClipboard(): [copyFn, copied] {
	const [copied, setCopied] = useState(false)

	const copy: copyFn = async (text: string) => {
		if (!navigator?.clipboard) {
			console.warn('Clipboard not supported')
			return false
		}

		// Try to save to clipboard then save it in the state if worked
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => {
				setCopied(false)
			}, 3000)
			return true
		} catch (error) {
			console.warn('Copy failed', error)
			return false
		}
	}

	return [copy, copied]
}
