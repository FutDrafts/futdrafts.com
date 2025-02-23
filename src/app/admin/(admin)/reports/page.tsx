import { TotalReportsCard } from './_total-reports-card'
import { PendingReportsCard } from './_pending-reports-card'
import { ResolvedReportsCard } from './_resolved-reports-card'
import ReportsTable from './_table'
import { getReportCount } from '@/actions/admin/reports'
import { toast } from 'sonner'

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
                <TotalReportsCard totalReports={totalReportCount ?? 0} />
                <PendingReportsCard pendingReports={pendingReportCount ?? 0} />
                <ResolvedReportsCard resolvedReports={resolvedReportCount ?? 0} />
            </div>

            <ReportsTable />
        </div>
    )
}
