import ReportsTable from './_table'
import { getReportCount } from '@/actions/admin/reports'
import { toast } from 'sonner'
import { AdminQuickStatCard } from '@/components/admin-quick-stat-card'

export default async function ReportsManagement() {
    const {
        totalReportCount,
        resolvedReportCount,
        pendingReportCount,
        error: reportCountError,
    } = await getReportCount()

    if (reportCountError) {
        toast.error(reportCountError)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Reports Management</h1>
                <p className="text-muted-foreground">Review and manage reported users and content</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <AdminQuickStatCard
                    title="Total Reports"
                    description="All time reports"
                    statistic={totalReportCount ?? 0}
                />
                <AdminQuickStatCard
                    title="Pending Reports"
                    description="Reports awaiting review"
                    statistic={pendingReportCount ?? 0}
                />
                <AdminQuickStatCard
                    title="Resolved Reports"
                    description="Reports resolved"
                    statistic={resolvedReportCount ?? 0}
                />
            </div>

            <ReportsTable />
        </div>
    )
}
