'use client'

import { Wrench } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function MaintenancePage() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkSession() {
            try {
                const session = await authClient.getSession()
                setIsAdmin(session?.data?.user?.role === '')
            } catch (error) {
                console.error('Failed to check session:', error)
            } finally {
                setLoading(false)
            }
        }

        checkSession()
    }, [])

    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center">
            <div className="container flex max-w-[700px] flex-col items-center gap-4 text-center">
                <Wrench className="text-primary h-12 w-12 animate-pulse" />
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Under Maintenance</h1>
                <p className="text-muted-foreground max-w-[600px] text-lg sm:text-xl">
                    We&apos;re currently performing some maintenance on our site. We&apos;ll be back shortly.
                </p>
                {!loading && isAdmin && (
                    <div className="flex gap-4">
                        <Button asChild variant="outline">
                            <Link href="/admin/settings">Admin Settings</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
