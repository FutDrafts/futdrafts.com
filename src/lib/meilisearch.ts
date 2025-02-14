import { env } from '@/env/client'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

// Initialize the MeiliSearch client
export const { searchClient } = instantMeiliSearch(
    env.NEXT_PUBLIC_MEILISEARCH_HOST,
    env.NEXT_PUBLIC_MEILISEARCH_API_KEY,
)
