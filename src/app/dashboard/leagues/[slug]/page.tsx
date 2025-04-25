import { Suspense } from 'react'
import { LeagueHeader } from './_components/league-header'
import { LeagueInfo } from './_components/league-info'
import { LeagueTabs } from './_components/league-tabs'
import { getFantasyLeagueByCode } from '@/actions/dashboard/fantasy'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { FantasyLeagueType } from './_components/types'

export default async function LeagueDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const fantasyLeague = (await getFantasyLeagueByCode(slug)) as FantasyLeagueType | null

    if (!fantasyLeague) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-destructive">Fantasy league not found</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            }
        >
            <div className="flex h-full">
                <div className="flex-1">
                    <div className="space-y-6">
                        <LeagueHeader fantasyLeague={fantasyLeague} leagueCode={slug} />
                        <LeagueInfo fantasyLeague={fantasyLeague} />
                        <LeagueTabs fantasyLeague={fantasyLeague} />
                    </div>
                </div>
            </div>
        </Suspense>
    )
}
