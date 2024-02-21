import { ChangeEvent } from 'react'
import { type ClassValue, clsx } from 'clsx'
import { BytesLike, ethers } from 'ethers'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs))
}

export function convertFileToBase64(
	event: ChangeEvent<HTMLInputElement>,
	callback: (base64: string | ArrayBuffer | null) => void
): void {
	const file = event.target.files ? event.target.files[0] : null

	if (file) {
		const reader = new FileReader()
		reader.onloadend = () => {
			callback(reader.result)
		}
		reader.readAsDataURL(file)
	}
}

export function convertTimestampToDate(time: number): Date {
	return new Date(time * 1000)
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
