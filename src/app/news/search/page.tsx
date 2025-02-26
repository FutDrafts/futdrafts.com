'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface NewsDocument {
    id: string
    title: string
    content: string
    date: string
    category: string
}

function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''

    return (
        <div className="space-y-8 py-8">
            <Input type="search" placeholder="Search news..." className="mb-8" defaultValue={query} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Add your search results mapping here */}
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <div className="text-muted-foreground text-sm">
                                Example Category • {new Date().toLocaleDateString()}
                            </div>
                            <h2 className="text-xl font-semibold">Example News Title</h2>
                            <p className="text-muted-foreground line-clamp-3">
                                This is an example news article content. Replace this with your actual search
                                implementation.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center py-12">
                    <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
                </div>
            }
        >
            <SearchResults />
        </Suspense>
    )
}
