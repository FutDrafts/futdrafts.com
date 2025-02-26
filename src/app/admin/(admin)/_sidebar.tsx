import { Button } from '@/components/ui/button'
import { AdminSidebarNavigation } from './_sidebar-nav'
import { AdminSidebarProfile } from './_sidebar-profile'
import { ChevronLeftIcon } from 'lucide-react'
import { getLimitedUserInfo } from '@/actions/admin/user'
import { getReportCount } from '@/actions/admin/reports'
import { toast } from 'sonner'

export async function AdminSidebar() {
    const user = await getLimitedUserInfo()
    const { pendingReportCount, error: reportCountError } = await getReportCount()

    if (reportCountError) {
        toast.error(reportCountError)
    }

    return (
        <aside
            className={
                'bg-card fixed left-0 top-0 z-50 mr-4 flex h-full w-64 flex-col border-r transition-all duration-150'
            }
        >
            {/* Sidebar Header */}
            <div className="flex h-16 items-center justify-between border-b px-4">
                <span className="text-lg font-semibold">FutDrafts Admin</span>
                <Button variant="ghost" size="icon" className="ml-auto" disabled>
                    <ChevronLeftIcon className="h-5 w-5" />
                </Button>
            </div>

            {/* Sidebar Navigation */}
            <AdminSidebarNavigation reportCount={pendingReportCount ?? 0} />

            {/* Profile Section */}
            <AdminSidebarProfile user={user} />
        </aside>
    )
}
