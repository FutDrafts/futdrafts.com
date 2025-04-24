'use client'

import { SeparatorWithText } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
    LayoutDashboardIcon,
    NewspaperIcon,
    UsersIcon,
    AlertTriangleIcon,
    TrophyIcon,
    Gamepad2Icon,
    SettingsIcon,
    ClipboardListIcon,
    ShieldUserIcon,
    BookUserIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SIDEBAR_GROUPS = [
    {
        title: 'General',
        items: [
            {
                title: 'Dashboard',
                href: '/admin',
                icon: LayoutDashboardIcon,
            },
            {
                title: 'Blog Management',
                href: '/admin/blog',
                icon: NewspaperIcon,
            },
            {
                title: 'Changelog',
                href: '/admin/changelog',
                icon: ClipboardListIcon,
            },
            {
                title: 'User Management',
                href: '/admin/users',
                icon: UsersIcon,
            },
            {
                title: 'Waitlist Users',
                href: '/admin/waitlist',
                icon: BookUserIcon,
            },
            {
                title: 'Reports',
                href: '/admin/reports',
                icon: AlertTriangleIcon,
            },
            {
                title: 'Settings',
                href: '/admin/settings',
                icon: SettingsIcon,
            },
        ],
    },
    {
        title: 'FutDrafts',
        items: [
            {
                title: 'Soccer Leagues',
                href: '/admin/leagues',
                icon: TrophyIcon,
            },
            {
                title: 'Soccer Teams',
                href: '/admin/teams',
                icon: UsersIcon,
            },
            {
                title: 'Players',
                href: '/admin/players',
                icon: ShieldUserIcon,
            },
            {
                title: 'Fantasy Leagues',
                href: '/admin/fantasy',
                icon: Gamepad2Icon,
            },
        ],
    },
]

interface Props {
    reportCount: number
}

export function AdminSidebarNavigation({ reportCount }: Props) {
    const pathname = usePathname()

    return (
        <nav className="flex-1 space-y-1 p-2">
            {SIDEBAR_GROUPS.map((group) => {
                return (
                    <div key={group.title} className="w-full">
                        <SeparatorWithText text={group.title} className="uppercase" />
                        {group.items.map((item) => {
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
                                    <Icon className="size-5" />
                                    <span className="flex-1">{item.title}</span>
                                    {item.href === '/admin/reports' && reportCount > 0 && (
                                        <span className="bg-destructive text-destructive-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs">
                                            {reportCount}
                                        </span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                )
            })}
        </nav>
    )
}
