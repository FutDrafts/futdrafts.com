import { config } from '@/db/schema'
import { env } from '@/env/client'

export interface AppConfig {
    maxResultsPerPage: number
    defaultLanguage: string
    siteName: string
    siteUrl: string
    siteDescription: string
    maintenance: boolean
}

const defaultConfig: AppConfig = {
    maxResultsPerPage: 25,
    defaultLanguage: 'en',
    siteName: 'FutDrafts',
    siteUrl: env.NEXT_PUBLIC_APP_URL || 'https://futdrafts.com',
    siteDescription: 'Fantasy Football Draft',
    maintenance: false,
}

type ConfigType = typeof config.$inferSelect

export async function getConfig(): Promise<AppConfig> {
    'use server'
    try {
        const response = await fetch(`${env.NEXT_PUBLIC_APP_URL}/api/admin/settings`)
        if (!response.ok) throw new Error('Failed to fetch config')

        const cfg = (await response.json()) as ConfigType[]

        const newCfg = cfg.reduce(
            (acc, { key, value }) => ({
                ...acc,
                [key]: value,
            }),
            defaultConfig,
        )

        return newCfg
    } catch (error) {
        console.error('Error fetching config', error)
        return defaultConfig
    }
}
