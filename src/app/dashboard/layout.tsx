'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <Button
                onClick={async () =>
                    await authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                toast.success('Signed out successfully', { duration: 600 })

                                setTimeout(() => {
                                    router.push('/')
                                }, 500)
                            },
                        },
                    })
                }
            >
                Sign Out
            </Button>
            {children}
        </div>
    )
}
