'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { searchNews } from '@/lib/meilisearch'

interface SearchResult {
    id: string
    title: string
    content: string
    date: string
    category: string
    _formatted?: {
        title: string
        content: string
    }
}

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const [results, setResults] = useState<SearchResult[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function performSearch() {
            if (!query) {
                setResults([])
                return
            }

            setLoading(true)
            try {
                const searchResults = await searchNews(query)
                setResults(searchResults as SearchResult[])
            } catch (error) {
                console.error('Search failed:', error)
                setResults([])
            } finally {
                setLoading(false)
            }
        }

        performSearch()
    }, [query])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!query) {
        return <div className="py-12 text-center text-muted-foreground">Enter a search term to find articles</div>
    }

    if (results.length === 0) {
        return <div className="py-12 text-center text-muted-foreground">No results found for &ldquo;{query}&rdquo;</div>
    }

    return (
        <div className="space-y-8 py-8">
            <h1 className="text-2xl font-bold">Search results for &ldquo;{query}&rdquo;</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((result) => (
                    <article
                        key={result.id}
                        className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                    >
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                                {result.category} • {new Date(result.date).toLocaleDateString()}
                            </div>
                            <h2 className="text-xl font-semibold">{result._formatted?.title || result.title}</h2>
                            <p className="line-clamp-3 text-muted-foreground">
                                {result._formatted?.content || result.content}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
