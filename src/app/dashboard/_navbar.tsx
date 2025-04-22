'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DASHBOARD_NAVIGATION_ITEMS } from '@/lib/constants'
import { XIcon, MenuIcon, MessageSquareIcon, ShieldPlusIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserIcon, LogOutIcon } from 'lucide-react'
import { Session, User } from '@/lib/types'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import ThemeSwitcher from '@/components/theme-switcher'
import { ChangelogNotification } from '@/components/changelog/changelog-notification'

interface Props {
    session: { user: User; session: Session } | null
}

export function DashboardNavbar({ session }: Props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success('Signed out successfully', { duration: 600 })

                    setTimeout(() => {
                        redirect('/')
                    }, 500)
                },
            },
        })
    }

    return (
        <>
            {/* Top Navigation Bar */}
            <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                        </Button>
                    </div>
                    <div className="mr-4 hidden md:flex">
                        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                            <span className="hidden font-bold sm:inline-block">FutDrafts</span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            {DASHBOARD_NAVIGATION_ITEMS.map((item) => (
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
                    <div className="flex flex-1 items-center justify-end gap-2 space-x-4">
                        <Button variant="ghost" size="icon" className="relative" aria-label="League Chats" disabled>
                            <MessageSquareIcon className="h-5 w-5" />
                        </Button>

                        <ChangelogNotification />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session?.user.image || '#'} alt={session?.user.name || ''} />
                                        <AvatarFallback>{session?.user.name.slice(0, 2) || ''}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm leading-none font-medium">{session?.user.name}</p>
                                        <p className="text-muted-foreground text-xs leading-none">
                                            {session?.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">
                                        <UserIcon className="mr-2 size-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                {session?.user.role === 'admin' && (
                                    <DropdownMenuItem>
                                        <ShieldPlusIcon className="mr-2 size-4" />
                                        Admin Dashboard
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOutIcon className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ThemeSwitcher />
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="animate-in slide-in-from-bottom-80 fixed inset-0 top-14 z-50 grid h-[calc(100vh-3.5rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-lg md:hidden">
                    <div className="bg-popover text-popover-foreground relative z-20 grid gap-6 rounded-md p-4 shadow-md">
                        <nav className="grid grid-flow-row auto-rows-max text-sm">
                            {DASHBOARD_NAVIGATION_ITEMS.map((item) => (
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
        </>
    )
}
