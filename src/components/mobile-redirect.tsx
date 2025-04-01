'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function MobileRedirect() {
    const router = useRouter()

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)')

        const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
                router.push('/dashboard')
            }
        }

        // Check initial size
        handleResize(mediaQuery)

        // Listen for changes
        mediaQuery.addEventListener('change', handleResize)

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleResize)
    }, [router])

    return null
}
