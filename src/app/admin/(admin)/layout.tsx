'use client'

import { useState } from 'react'
import { redirect, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import { AdminSidebar } from '@/app/admin/(admin)/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const isMobile = useIsMobile()

    if (isMobile) {
        redirect('/admin/error/mobile')
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} pathname={pathname} />

            {/* Main Content */}
            <main className={cn('ml-4 min-h-screen transition-all duration-300', collapsed ? 'pl-16' : 'pl-64')}>
                <div className="container py-8">{children}</div>
            </main>
        </div>
    )
}
