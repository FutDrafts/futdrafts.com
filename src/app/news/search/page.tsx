'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchClient } from '@/lib/meilisearch'
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch'
import type { Hit } from 'instantsearch.js'
import 'instantsearch.css/themes/satellite.css'

interface NewsDocument {
    id: string
    title: string
    content: string
    date: string
    category: string
}

interface SearchResult extends Hit<NewsDocument> {
    _formatted?: {
        title: string
        content: string
    }
}

function SearchHit({ hit }: { hit: SearchResult }) {
    return (
        <article className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md" key={hit.id}>
            <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                    {hit.category} • {new Date(hit.date).toLocaleDateString()}
                </div>
                <h2 className="text-xl font-semibold">{hit._formatted?.title || hit.title}</h2>
                <p className="line-clamp-3 text-muted-foreground">{hit._formatted?.content || hit.content}</p>
            </div>
        </article>
    )
}

function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''

    return (
        <InstantSearch
            /* eslint-disable @typescript-eslint/no-explicit-any */
            searchClient={searchClient as any}
            indexName="news"
            initialUiState={{
                news: {
                    query,
                },
            }}
        >
            <div className="space-y-8 py-8">
                <SearchBox placeholder="Search news..." className="mb-8" />
                <Hits<SearchResult>
                    hitComponent={SearchHit}
                    classNames={{
                        list: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
                        item: 'p-0!',
                    }}
                />
            </div>
        </InstantSearch>
    )
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            }
        >
            <SearchResults />
        </Suspense>
    )
}
