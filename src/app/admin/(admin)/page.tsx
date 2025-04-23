import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Newspaper, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import { getDashboardAnalytics, getRecentArticles, getRecentUsers } from '@/actions/admin/dashboard'

export default async function AdminDashboard() {
    const [articles, users, metrics] = await Promise.all([
        await getRecentArticles({ limit: 3 }),
        await getRecentUsers({ limit: 3 }),
        await getDashboardAnalytics(),
    ])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin</p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <Button asChild>
                    <Link href="/admin/blog/create">
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
                        <div
                            className={`flex items-center text-xs ${parseFloat(metrics.userGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {parseFloat(metrics.userGrowth) >= 0 ? (
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4" />
                            )}
                            {parseFloat(metrics.userGrowth) >= 0 ? '+' : ''}
                            {metrics.userGrowth}% from last month
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
                        <div
                            className={`flex items-center text-xs ${parseFloat(metrics.articleGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {parseFloat(metrics.articleGrowth) >= 0 ? (
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4" />
                            )}
                            {parseFloat(metrics.articleGrowth) >= 0 ? '+' : ''}
                            {metrics.articleGrowth}% from last month
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

                        <div
                            className={`flex items-center text-xs ${parseFloat(metrics.visitsGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                            {parseFloat(metrics.visitsGrowth) >= 0 ? (
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                            ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4" />
                            )}
                            {parseFloat(metrics.visitsGrowth) >= 0 ? '+' : ''}
                            {metrics.visitsGrowth}% from yesterday
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
                                (parseInt(metrics.activeUsers.replace(/[^\d]/g, '')) /
                                    parseInt(metrics.totalUsers.replace(/[^\d]/g, ''))) *
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
                                {articles ? (
                                    articles.map((article) => (
                                        <div
                                            key={article.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium">{article.title}</p>
                                                <div className="text-muted-foreground flex text-sm">
                                                    <span>{article.author.name}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{new Date(article.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/blog/edit/${article.id}`}>Edit</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No articles found</div>
                                )}
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
                                {users ? (
                                    users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between rounded-lg border p-4"
                                        >
                                            <div className="space-y-1">
                                                <p className="font-medium">{user.name}</p>
                                                <div className="text-muted-foreground flex text-sm">
                                                    <span>{user.email}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        !user.banned
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-500'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-500'
                                                    }`}
                                                >
                                                    {user.banned ? 'Banned' : 'Active'}
                                                </span>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/users?user=${user.id}`}>View</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No users found</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
