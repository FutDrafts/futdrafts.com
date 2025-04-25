'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar } from 'lucide-react'
import { FantasyLeagueType } from './types'

interface LeagueInfoProps {
    fantasyLeague: FantasyLeagueType
}

export function LeagueInfo({ fantasyLeague }: LeagueInfoProps) {
    const formatDate = (date: Date | null) => {
        if (!date) return 'Not set'
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Participants</CardTitle>
                    <Users className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {fantasyLeague.minimumPlayer}/{fantasyLeague.maximumPlayer}
                    </div>
                    <p className="text-muted-foreground text-xs">Active players in league</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Season</CardTitle>
                    <Calendar className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{fantasyLeague.league.name}</div>
                    <p className="text-muted-foreground text-xs">
                        {fantasyLeague.startDate && fantasyLeague.endDate
                            ? `${formatDate(new Date(fantasyLeague.startDate))} - ${formatDate(new Date(fantasyLeague.endDate))}`
                            : `${formatDate(null)} - ${formatDate(null)}`}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                    <Badge variant={fantasyLeague.status === 'active' ? 'default' : 'outline'}>
                        {fantasyLeague.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{fantasyLeague.user.name}</div>
                    <p className="text-muted-foreground text-xs">League Owner</p>
                </CardContent>
            </Card>
        </div>
    )
}
