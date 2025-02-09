'use client'

import { Wrench } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { betterFetch } from '@better-fetch/fetch'
import { auth } from '@/lib/auth'

type Session = typeof auth.$Infer.Session

export default function MaintenancePage() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkSession() {
            try {
                const { data: session } = await betterFetch<Session>('/api/auth/get-session')
                setIsAdmin(session?.user?.role === 'admin')
            } catch (error) {
                console.error('Failed to check session:', error)
            } finally {
                setLoading(false)
            }
        }

        checkSession()
    }, [])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <div className="container flex max-w-[700px] flex-col items-center gap-4 text-center">
                <Wrench className="h-12 w-12 animate-pulse text-primary" />
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Under Maintenance</h1>
                <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
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
