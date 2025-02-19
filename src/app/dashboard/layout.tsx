'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Search, Trophy, BarChart3, User, Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

const navigationItems = [
    {
        title: 'Home',
        href: '/dashboard',
        icon: Home,
        description: 'Overview and quick access',
    },
    {
        title: 'Leagues',
        href: '/dashboard/leagues',
        icon: Trophy,
        description: 'Browse and join leagues',
    },
    {
        title: 'Search',
        href: '/dashboard/search',
        icon: Search,
        description: 'Find leagues and players',
    },
    {
        title: 'Stats',
        href: '/dashboard/stats',
        icon: BarChart3,
        description: 'Player and team statistics',
    },
    {
        title: 'Profile',
        href: '/dashboard/profile',
        icon: User,
        description: 'Your profile and settings',
    },
]

// Mock user data - replace with actual user data
const currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
    image: '/avatars/john-doe.jpg',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success('Signed out successfully')
                    window.location.href = '/'
                },
            },
        })
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Top Navigation Bar */}
            <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                    <div className="mr-4 hidden md:flex">
                        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                            <span className="hidden font-bold sm:inline-block">FutDrafts</span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'hover:text-foreground/80 transition-colors',
                                        pathname === item.href ? 'text-foreground' : 'text-foreground/60',
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={currentUser.image} alt={currentUser.name} />
                                        <AvatarFallback>{currentUser.name.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm leading-none font-medium">{currentUser.name}</p>
                                        <p className="text-muted-foreground text-xs leading-none">
                                            {currentUser.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="animate-in slide-in-from-bottom-80 fixed inset-0 top-14 z-50 grid h-[calc(100vh-3.5rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-lg md:hidden">
                    <div className="bg-popover text-popover-foreground relative z-20 grid gap-6 rounded-md p-4 shadow-md">
                        <nav className="grid grid-flow-row auto-rows-max text-sm">
                            {navigationItems.map((item) => (
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
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="container py-6">{children}</main>
        </div>
    )
}
