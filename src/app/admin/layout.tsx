'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { redirect, usePathname } from 'next/navigation'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile()
    const pathname = usePathname()

    if (isMobile && pathname !== '/admin/error/mobile') {
        redirect('/admin/error/mobile')
    }

    return <>{children}</>
}
