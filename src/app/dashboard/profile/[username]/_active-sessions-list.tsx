'use client'

import { useState } from 'react'
import { UAParser } from 'ua-parser-js'
import { MobileIcon } from '@radix-ui/react-icons'
import { LaptopIcon, Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { AuthSession, Session } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface ActiveSessionsListProps {
    activeSessions: Session[]
    currentSessionId?: string
}

export function ActiveSessionsList({ activeSessions, currentSessionId }: ActiveSessionsListProps) {
    const router = useRouter()
    const [isTerminating, setIsTerminating] = useState<string>()
    const [currentPage, setCurrentPage] = useState(1)

    const filteredSessions = activeSessions.filter((session) => session.userAgent)
    const sessionsPerPage = 10
    const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage)

    const indexOfLastSession = currentPage * sessionsPerPage
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage
    const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const handleTerminateSession = async (session: AuthSession['session']) => {
        setIsTerminating(session.id)
        const res = await authClient.revokeSession({
            token: session.token,
        })

        if (res.error) {
            toast.error(res.error.message)
        } else {
            toast.success('Session terminated successfully')
        }

        router.refresh()
        setIsTerminating(undefined)
    }

    return (
        <div className="flex flex-col gap-2">
            {currentSessions.map((session) => (
                <div key={session.id} className="flex justify-between rounded border px-4 py-3">
                    <div className="flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-black dark:text-white">
                            {new UAParser(session.userAgent || '').getDevice().type === 'mobile' ? (
                                <MobileIcon />
                            ) : (
                                <LaptopIcon size={16} />
                            )}
                            {new UAParser(session.userAgent || '').getOS().name},{' '}
                            {new UAParser(session.userAgent || '').getBrowser().name}
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {session.ipAddress ? `IP: ${session.ipAddress}` : 'Unknown IP'} •{' '}
                            {session.createdAt
                                ? formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })
                                : 'Unknown time'}
                        </p>
                    </div>
                    <Button
                        variant={'destructive'}
                        className="text-xs opacity-80 hover:cursor-pointer"
                        onClick={() => handleTerminateSession(session)}
                    >
                        {isTerminating === session.id ? (
                            <Loader2Icon size={15} className="animate-spin" />
                        ) : session.id === currentSessionId ? (
                            'Sign Out'
                        ) : (
                            'Terminate'
                        )}
                    </Button>
                </div>
            ))}

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}
