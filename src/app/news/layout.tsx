'use client'

import { useState } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { cn } from '@/lib/utils'
// import { searchNews } from '@/lib/meilisearch'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'
import { useEffect } from 'react'

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 300)

    useEffect(() => {
        if (debouncedSearch) {
            router.push(`/news/search?q=${encodeURIComponent(debouncedSearch)}`)
        }
    }, [debouncedSearch, router])

    const categories = [
        { name: 'Latest', href: '/news' },
        { name: 'Transfers', href: '/news/transfers' },
        { name: 'Match Reports', href: '/news/match-reports' },
        { name: 'Analysis', href: '/news/analysis' },
        { name: 'Interviews', href: '/news/interviews' },
    ]

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    return (
        <div className="min-h-screen">
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo and Mobile Menu Button */}
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-2 md:hidden"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                            <Link href="/news" className="text-xl font-bold">
                                News
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden space-x-4 md:flex">
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex w-full max-w-sm items-center md:w-64">
                            <Input
                                type="search"
                                placeholder="Search articles..."
                                className="pr-8"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Search className="absolute right-2 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={cn('border-b md:hidden', isMenuOpen ? 'block' : 'hidden')}>
                    <div className="container space-y-1 px-4 pb-3 pt-2">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.href}
                                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    )
}
