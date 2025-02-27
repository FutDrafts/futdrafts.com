import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

// Generate a random league code (e.g., "PREM-2X4Y-9Z7W")
export function generateLeagueCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const sections = [
        // League type prefix (4 chars)
        Array(4)
            .fill(0)
            .map(() => characters[Math.floor(Math.random() * characters.length)])
            .join(''),
        // Two sections of 4 characters each
        Array(4)
            .fill(0)
            .map(() => characters[Math.floor(Math.random() * characters.length)])
            .join(''),
        Array(4)
            .fill(0)
            .map(() => characters[Math.floor(Math.random() * characters.length)])
            .join(''),
    ]
    return sections.join('-')
}

// Format a league code for display (e.g., "PREM-2X4Y-9Z7W")
export function formatLeagueCode(code: string): string {
    return (
        code
            .toUpperCase()
            .match(/.{1,4}/g)
            ?.join('-') || code
    )
}

// Validate a league code format
export function isValidLeagueCode(code: string): boolean {
    const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/
    return pattern.test(code.toUpperCase())
}
