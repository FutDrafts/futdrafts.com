import { auth } from '@/lib/auth'
import { DashboardNavbar } from './_navbar'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import posthog from 'posthog-js'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }

    // const { maintenance } = await getConfig()
    // if (maintenance && session.user.role !== 'admin') {
    //     return redirect('/maintenance')
    // }

    posthog.identify(session.user.id, {
        name: session.user.name,
        email: session.user.email,
    })

    return (
        <div className="bg-background min-h-screen">
            <DashboardNavbar session={session} />

            {/* Main Content */}
            <main className="container py-6">{children}</main>
        </div>
    )
}
