import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ActiveUsersCard({ activeUsers }: { activeUsers: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Currently active accounts</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{activeUsers}</p>
            </CardContent>
        </Card>
    )
}
