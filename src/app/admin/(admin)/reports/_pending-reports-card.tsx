import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function PendingReportsCard({ pendingReports }: { pendingReports: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending</CardTitle>
                <CardDescription>Reports awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{pendingReports}</p>
            </CardContent>
        </Card>
    )
}
