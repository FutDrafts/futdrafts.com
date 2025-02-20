'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Newspaper, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with real data fetching
const metrics = {
    totalUsers: '10.2k',
    activeUsers: '8.9k',
    totalArticles: '245',
    dailyVisits: '15.2k',
    userGrowth: '+12.3%',
    articleGrowth: '+8.1%',
    visitsGrowth: '-3.2%',
}

const recentArticles = [
    {
        id: '1',
        title: 'Premier League Transfer Window Updates',
        author: 'John Doe',
        date: '2024-02-15',
        views: '1.2k',
    },
    {
        id: '2',
        title: 'Champions League Quarter-Finals Preview',
        author: 'Jane Smith',
        date: '2024-02-14',
        views: '890',
    },
    {
        id: '3',
        title: 'Top 10 Rising Stars to Watch',
        author: 'Mike Johnson',
        date: '2024-02-13',
        views: '2.1k',
    },
]

const recentUsers = [
    {
        id: '1',
        name: 'Alice Brown',
        email: 'alice@example.com',
        joinDate: '2024-02-15',
        status: 'active',
    },
    {
        id: '2',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        joinDate: '2024-02-14',
        status: 'pending',
    },
    {
        id: '3',
        name: 'Carol Davis',
        email: 'carol@example.com',
        joinDate: '2024-02-13',
        status: 'active',
    },
]

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin</p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <Button asChild>
                    <Link href="/admin/news/create">
                        <Newspaper className="mr-2 h-4 w-4" />
                        Create Article
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                    </Link>
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                        <div className="flex items-center text-xs text-green-500">
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            {metrics.userGrowth} from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <Newspaper className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalArticles}</div>
                        <div className="flex items-center text-xs text-green-500">
                            <ArrowUpRight className="mr-1 h-4 w-4" />
                            {metrics.articleGrowth} from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Visits</CardTitle>
                        <TrendingUp className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.dailyVisits}</div>
                        <div className="flex items-center text-xs text-red-500">
                            <ArrowDownRight className="mr-1 h-4 w-4" />
                            {metrics.visitsGrowth} from yesterday
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.activeUsers}</div>
                        <p className="text-muted-foreground text-xs">
                            {(
                                (parseInt(metrics.activeUsers.replace('k', '000')) /
                                    parseInt(metrics.totalUsers.replace('k', '000'))) *
                                100
                            ).toFixed(1)}
                            % of total users
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Tabs defaultValue="articles" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="articles">Recent Articles</TabsTrigger>
                    <TabsTrigger value="users">Recent Users</TabsTrigger>
                </TabsList>
                <TabsContent value="articles">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Articles</CardTitle>
                            <CardDescription>Latest published articles across all categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentArticles.map((article) => (
                                    <div
                                        key={article.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">{article.title}</p>
                                            <div className="text-muted-foreground flex text-sm">
                                                <span>{article.author}</span>
                                                <span className="mx-2">•</span>
                                                <span>{new Date(article.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-muted-foreground text-sm">{article.views} views</div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/news/${article.id}`}>View</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="users">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Users</CardTitle>
                            <CardDescription>Latest user registrations and activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">{user.name}</p>
                                            <div className="text-muted-foreground flex text-sm">
                                                <span>{user.email}</span>
                                                <span className="mx-2">•</span>
                                                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    user.status === 'active'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-500'
                                                }`}
                                            >
                                                {user.status}
                                            </span>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/users?user=${user.id}`}>View</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
