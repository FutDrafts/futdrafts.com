import Link from 'next/link'
import { SearchBar } from './_components/_search-bar'

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            {/* Navigation Bar */}
            <nav className="bg-background/80 backdrop-blur-xs sticky top-0 z-50 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo and Mobile Menu Button */}
                        <div className="flex items-center">
                            <Link href="/news" className="text-xl font-bold">
                                FutDraft News
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <SearchBar />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    )
}
