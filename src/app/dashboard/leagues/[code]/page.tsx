'use client'

import { use, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Settings, Share2 } from 'lucide-react'
import Link from 'next/link'
import { formatLeagueCode } from '@/lib/utils'

// Mock data - replace with real data fetching
const leagueData = {
    code: 'PREM-2X4Y-9Z7W',
    name: 'Premier Fantasy Masters',
    description: 'The ultimate Premier League fantasy experience',
    competition: 'Premier League',
    type: 'public',
    region: 'Global',
    maxParticipants: 100,
    currentParticipants: 45,
    entryFee: 1000,
    prizePool: 50000,
    startDate: '2024-02-25',
    endDate: '2024-05-19',
    rules: 'Standard Premier League fantasy rules apply. Weekly transfers allowed. Triple captain and bench boost chips available.',
    status: 'active',
    creator: {
        name: 'John Doe',
        image: '/avatars/john-doe.jpg',
    },
}

// ... rest of the mock data ...

export default function LeagueDetailsPage({ params }: { params: Promise<{ code: string }> }) {
    const [copied, setCopied] = useState(false)
    const { code } = use(params)

    const copyInviteLink = () => {
        navigator.clipboard.writeText(`https://futdrafts.com/leagues/${code}/join`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard/leagues">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">{leagueData.name}</h1>
                            <Badge variant="outline" className="font-mono">
                                {formatLeagueCode(code)}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{leagueData.description}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={copyInviteLink}>
                        <Share2 className="mr-2 h-4 w-4" />
                        {copied ? 'Copied!' : 'Share'}
                    </Button>
                    {leagueData.creator.name === 'John Doe' && (
                        <Button variant="outline" asChild>
                            <Link href={`/dashboard/leagues/${code}/settings`}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                    )}
                    <Button asChild>
                        <Link href={`/dashboard/leagues/${code}/join`}>Join League</Link>
                    </Button>
                </div>
            </div>

            {/* ... rest of the component remains the same ... */}
        </div>
    )
}
