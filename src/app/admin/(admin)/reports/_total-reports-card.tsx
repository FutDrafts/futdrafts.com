import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function TotalReportsCard({ totalReports }: { totalReports: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Total Reports</CardTitle>
                <CardDescription>All time reports</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{totalReports}</p>
            </CardContent>
        </Card>
    )
}
