'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Share2, MessageSquare, Globe, Lock, Users2Icon, TrophyIcon } from 'lucide-react'
import Link from 'next/link'
import { LeagueChatSidebar } from './league-chat-sidebar'
import { cn } from '@/lib/utils'
import { startDraft } from '@/actions/dashboard/draft'
import { FantasyLeagueType } from './types'

interface LeagueHeaderProps {
    fantasyLeague: FantasyLeagueType
    leagueSlug: string
}

export function LeagueHeader({ fantasyLeague, leagueSlug }: LeagueHeaderProps) {
    const [copied, setCopied] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)

    const copyInviteLink = () => {
        navigator.clipboard.writeText(
            `https://futdrafts.com/leagues/${leagueSlug}/join?joinCode=${fantasyLeague.joinCode}`,
        )
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    }

    const handleDraft = async () => {
        try {
            await startDraft(fantasyLeague.id)
            window.location.reload()
        } catch (error) {
            console.error('Error starting draft:', error)
        }
    }

    // Check if there are any H2H matches
    const hasH2HMatches = fantasyLeague.h2hMatches && fantasyLeague.h2hMatches.length > 0

    // Check if draft is completed to show H2H button
    const isDraftCompleted = fantasyLeague.draftStatus === 'finished'

    return (
        <>
            <div className={cn('flex-1 transition-all duration-300', isChatOpen ? 'mr-80 md:mr-96' : '')}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/dashboard/leagues">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold">{fantasyLeague.name}</h1>
                                <Badge variant={fantasyLeague.isPrivate ? 'outline' : 'secondary'}>
                                    {fantasyLeague.isPrivate ? (
                                        <Lock className="mr-1 h-3 w-3" />
                                    ) : (
                                        <Globe className="mr-1 h-3 w-3" />
                                    )}
                                    {fantasyLeague.isPrivate ? 'Private' : 'Public'}
                                </Badge>
                                {isDraftCompleted && (
                                    <Badge
                                        variant="outline"
                                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                    >
                                        Draft Complete
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">{fantasyLeague.description}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                        <Button variant="outline" onClick={copyInviteLink}>
                            <Share2 className="mr-2 h-4 w-4" />
                            {copied ? 'Copied!' : 'Share'}
                        </Button>
                        <Button
                            variant={isChatOpen ? 'default' : 'outline'}
                            onClick={toggleChat}
                            className={isChatOpen ? 'bg-primary' : ''}
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/dashboard/leagues/${leagueSlug}/team`}>
                                <Users2Icon className="mr-2 h-4 w-4" />
                                View Team
                            </Link>
                        </Button>

                        {isDraftCompleted && (
                            <Button
                                variant={hasH2HMatches ? 'default' : 'outline'}
                                className={hasH2HMatches ? 'bg-amber-600 hover:bg-amber-700' : ''}
                                onClick={() =>
                                    document.querySelector('[value="matches"]')?.dispatchEvent(new MouseEvent('click'))
                                }
                            >
                                <TrophyIcon className="mr-2 h-4 w-4" />
                                {hasH2HMatches ? 'View H2H Matches' : 'Set Up H2H Matches'}
                            </Button>
                        )}

                        {fantasyLeague.draftStatus === 'pending' && <Button onClick={handleDraft}>Start Draft</Button>}
                        {fantasyLeague.draftStatus === 'in-progress' && (
                            <Button asChild>
                                <Link href={`/dashboard/leagues/${leagueSlug}/draft`}>Go To Draft</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Sidebar */}
            <div className="fixed top-0 right-0 h-full">
                {isChatOpen && (
                    <LeagueChatSidebar
                        isOpen={isChatOpen}
                        onClose={() => setIsChatOpen(false)}
                        leagueSlug={leagueSlug}
                        leagueId={fantasyLeague.id}
                    />
                )}
            </div>
        </>
    )
}
