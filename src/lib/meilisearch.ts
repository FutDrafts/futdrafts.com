import { MeiliSearch } from 'meilisearch'
import { env as serverEnv } from '@/env/server'
import { env as clientEnv } from '@/env/client'

// Initialize the MeiliSearch client
const client = new MeiliSearch({
    host: clientEnv.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700',
    apiKey: serverEnv.MEILISEARCH_API_KEY,
})

// Get the news index
export const newsIndex = client.index('news')

// Search function
export async function searchNews(query: string) {
    if (!query.trim()) return []

    try {
        const results = await newsIndex.search(query, {
            limit: 10,
            attributesToHighlight: ['title', 'content'],
        })
        return results.hits
    } catch (error) {
        console.error('Search error:', error)
        return []
    }
}
