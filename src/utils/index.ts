import { type ClassValue, clsx } from 'clsx'
import { BytesLike, ethers } from 'ethers'
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

export function toDecimal(value: number): bigint {
	return BigInt(value * 10 ** 18)
}

export function toNumber(value: bigint): number {
	return Number(value) / 10 ** 18
}

export function toTimestamp(date: string): number {
	return Math.floor(new Date(date).getTime() / 1000)
}

export function toAbiCoder(structType: string[], dataValues: any[]): BytesLike {
	const abiCoder = new ethers.AbiCoder()
	return abiCoder.encode(structType, dataValues)
}
