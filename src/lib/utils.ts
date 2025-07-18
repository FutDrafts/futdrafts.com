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

// Generate a URL-friendly slug from text
export function generateSlug(text: string, appendId: boolean = true): string {
    const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove consecutive hyphens

    if (appendId) {
        const uniqueId = Math.random().toString(36).substring(2, 6)
        return `${slug}-${uniqueId}`
    }

    return slug
}

export function shuffleInPlace<T>(array: T[]): void {
    let currentIndex = array.length
    let randomIndex: number
    let temporaryValue: T

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
}

export const formatNumber = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
}
