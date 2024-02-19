import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs))
}
export function convertTimestampToDate(time: number): string {
	const date: Date = new Date(time * 1000)
	const year: number = date.getFullYear()
	const month: string = (date.getMonth() + 1).toString().padStart(2, '0')
	const day: string = date.getDate().toString().padStart(2, '0')
	return `${year}-${month}-${day}`
}

export function formatAddress(address: string): string {
	return address.slice(0, 6) + '...' + address.slice(-4)
}
