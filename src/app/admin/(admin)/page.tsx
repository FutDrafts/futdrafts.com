'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Newspaper, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { post, user } from '@/db/schema'

type Post = typeof post.$inferSelect & {
    author: typeof user.$inferSelect
    views: number
}
type User = typeof user.$inferSelect

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState({
        totalUsers: '0',
        activeUsers: '0',
        totalArticles: '0',
        dailyVisits: '0',
        userGrowth: '0',
        articleGrowth: '0',
        visitsGrowth: '0',
    })

    const [recentArticles, setRecentArticles] = useState<Post[]>([])
    const [recentUsers, setRecentUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch real statistics
        const fetchStats = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await fetch('/api/admin/statistics')
                const data = await response.json()

                setMetrics({
                    totalUsers: data.totalUsers.toString(),
                    activeUsers: data.activeUsers.toString(),
                    totalArticles: data.totalArticles.toString(),
                    dailyVisits: data.dailyVisits.toString(),
                    userGrowth: data.userGrowth.toString(),
                    articleGrowth: data.articleGrowth.toString(),
                    visitsGrowth: data.visitsGrowth.toString(),
                })
            } catch (error) {
                console.error('Failed to fetch statistics:', error)
                // Fallback to sample data in case of error
                setMetrics({
                    totalUsers: '10.2k',
                    activeUsers: '8.9k',
                    totalArticles: '245',
                    dailyVisits: '15.2k',
                    userGrowth: '12.3',
                    articleGrowth: '8.1',
                    visitsGrowth: '-3.2',
                })
            } finally {
                setLoading(false)
            }
        }

        // Fetch recent articles
        const fetchRecentArticles = async () => {
            try {
                const response = await fetch('/api/admin/recent-articles')
                const data = await response.json()
                setRecentArticles(data.articles)
            } catch (error) {
                console.error('Failed to fetch recent articles:', error)
                // Fallback to sample data
                setRecentArticles([])
            }
        }

        // Fetch recent users
        const fetchRecentUsers = async () => {
            try {
                const response = await fetch('/api/admin/recent-users')
                const data = await response.json()
                setRecentUsers(data.users)
            } catch (error) {
                console.error('Failed to fetch recent users:', error)
                // Fallback to sample data
                setRecentUsers([])
            }
        }

        fetchStats()
        fetchRecentArticles()
        fetchRecentUsers()
    }, [])

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
                        <div className="text-2xl font-bold">{loading ? 'Loading...' : metrics.totalUsers}</div>
                        {!loading && (
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
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                        <Newspaper className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? 'Loading...' : metrics.totalArticles}</div>
                        {!loading && (
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
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Visits</CardTitle>
                        <TrendingUp className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? 'Loading...' : metrics.dailyVisits}</div>
                        {!loading && (
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
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? 'Loading...' : metrics.activeUsers}</div>
                        {!loading && (
                            <p className="text-muted-foreground text-xs">
                                {(
                                    (parseInt(metrics.activeUsers.replace(/[^\d]/g, '')) /
                                        parseInt(metrics.totalUsers.replace(/[^\d]/g, ''))) *
                                    100
                                ).toFixed(1)}
                                % of total users
                            </p>
                        )}
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
                                {recentArticles ? (
                                    recentArticles.map((article) => (
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
                                                <div className="text-muted-foreground text-sm">
                                                    {article.views ?? 0} views
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/news/edit/${article.id}`}>Edit</Link>
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
                                {recentUsers ? (
                                    recentUsers.map((user) => (
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
