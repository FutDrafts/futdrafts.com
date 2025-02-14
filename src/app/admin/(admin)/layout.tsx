'use client'

import { useState } from 'react'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Newspaper,
    Users,
    AlertTriangle,
    Settings,
    ChevronLeft,
    Menu,
    Trophy,
    Gamepad2,
    LogOut,
} from 'lucide-react'
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
import { useIsMobile } from '@/hooks/use-mobile'

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'News Management',
        href: '/admin/news',
        icon: Newspaper,
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Soccer Leagues',
        href: '/admin/leagues',
        icon: Trophy,
    },
    {
        title: 'Players',
        href: '/admin/players',
        icon: Users,
    },
    {
        title: 'Fantasy Leagues',
        href: '/admin/fantasy',
        icon: Gamepad2,
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        icon: AlertTriangle,
        badge: '3', // You can make this dynamic based on actual reports
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
]

// Mock user data - replace with actual user data
const currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    image: '/avatars/john-doe.jpg', // Replace with actual image path
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const isMobile = useIsMobile()

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

    if (isMobile) {
        redirect('/admin/error/mobile')
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-50 mr-4 flex h-full flex-col border-r bg-card transition-all duration-150',
                    collapsed ? 'w-16' : 'w-64',
                )}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b px-4">
                    {!collapsed && <span className="text-lg font-semibold">FutDrafts Admin</span>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="ml-auto"
                        disabled
                    >
                        {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 space-y-1 p-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                    pathname === item.href
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {!collapsed && <span className="flex-1">{item.title}</span>}
                                {!collapsed && item.badge && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Profile Section */}
                <div className="border-t p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={cn(
                                    'flex w-full items-center gap-2 px-2',
                                    collapsed && 'justify-center px-0',
                                )}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={currentUser.image} alt={currentUser.name} />
                                    <AvatarFallback>{currentUser.name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                {!collapsed && (
                                    <div className="flex flex-1 flex-col items-start text-sm">
                                        <span className="font-medium">{currentUser.name}</span>
                                        <span className="text-xs text-muted-foreground">{currentUser.role}</span>
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile">
                                    <Users className="mr-2 h-4 w-4" />
                                    Profile Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSignOut}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn('ml-4 min-h-screen transition-all duration-300', collapsed ? 'pl-16' : 'pl-64')}>
                <div className="container py-8">{children}</div>
            </main>
        </div>
    )
}
