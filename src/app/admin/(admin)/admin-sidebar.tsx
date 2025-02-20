import { cn } from '@/lib/utils'
import { ChevronLeft, Settings, Trophy, Users, Newspaper, LayoutDashboard, Gamepad2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'
import { Menu } from 'lucide-react'

interface Props {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
    pathname: string
}

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

export function AdminSidebar({ collapsed, setCollapsed, pathname }: Props) {
    return (
        <aside
            className={cn(
                'bg-card fixed top-0 left-0 z-50 mr-4 flex h-full flex-col border-r transition-all duration-150',
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
                                <span className="bg-destructive text-destructive-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* <ProfileButton collapsed={collapsed} session={session?.data} /> */}
        </aside>
    )
}
