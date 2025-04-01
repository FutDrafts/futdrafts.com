import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getConfig } from '@/actions/admin/config'
import { MobileRedirect } from '@/components/mobile-redirect'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/auth/sign-in')
    }

    if (session.user.role === 'user') {
        redirect('/dashboard')
    }

    const { maintenance } = await getConfig()
    if (maintenance && session.user.role !== 'admin') {
        redirect('/maintenance')
    }

    return (
        <>
            <MobileRedirect />
            {children}
        </>
    )
}
