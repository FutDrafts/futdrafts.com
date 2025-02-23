import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function BannedUsersCard({ bannedUsers }: { bannedUsers: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Banned Users</CardTitle>
                <CardDescription>Suspended accounts</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{bannedUsers}</p>
            </CardContent>
        </Card>
    )
}
