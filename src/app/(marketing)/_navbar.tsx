'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ThemeSwitcher from '@/components/theme-switcher'
import { MenuIcon, XIcon } from 'lucide-react'

const MARKETING_NAV_ITEMS = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
    { href: '/changelog', label: 'Changelog' },
]

export function MarketingNavbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    return (
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold">FutDrafts</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex md:items-center md:space-x-6">
                    {MARKETING_NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'hover:text-primary text-sm font-medium transition-colors',
                                pathname === item.href ? 'text-foreground' : 'text-muted-foreground',
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Button variant="ghost" asChild>
                            <Link href="/auth/sign-in">Sign In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/auth/sign-up">Sign Up</Link>
                        </Button>
                    </div>

                    <ThemeSwitcher />

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="animate-in slide-in-from-bottom-80 fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md">
                        <div className="bg-popover text-popover-foreground relative z-20 grid gap-6 rounded-md p-4 shadow-md">
                            <nav className="grid grid-flow-row auto-rows-max text-sm">
                                {MARKETING_NAV_ITEMS.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                                            pathname === item.href
                                                ? 'bg-accent text-accent-foreground'
                                                : 'text-muted-foreground',
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div className="mt-4 flex flex-col space-y-2">
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href="/auth/sign-in">Sign In</Link>
                                    </Button>
                                    <Button asChild className="w-full">
                                        <Link href="/auth/sign-up">Sign Up</Link>
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
