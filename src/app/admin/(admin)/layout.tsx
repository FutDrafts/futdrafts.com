import { cn } from '@/lib/utils'
import { AdminSidebar } from './_sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className={cn('ml-4 min-h-screen pl-64 transition-all duration-300')}>
                <div className="container py-8">{children}</div>
            </main>
        </div>
    )
}
