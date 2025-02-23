import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export async function ResolvedReportsCard({ resolvedReports }: { resolvedReports: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resolved</CardTitle>
                <CardDescription>Handled reports</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{resolvedReports}</p>
            </CardContent>
        </Card>
    )
}
