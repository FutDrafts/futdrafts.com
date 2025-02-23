import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default async function TotalUsersCard({ totalUsers }: { totalUsers: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Active and inactive accounts</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{totalUsers}</p>
            </CardContent>
        </Card>
    )
}
