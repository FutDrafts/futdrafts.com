'use client'

import { TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TrophyIcon, Loader2Icon, PencilIcon, MoreHorizontalIcon, FlagIcon } from 'lucide-react'
import { AuthSession, Session, User } from '@/lib/types'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { ActiveSessionsList } from './_active-sessions-list'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ReportUserDialog } from '@/components/report-user-dialog'

const mockLeagues = [
    {
        id: '1',
        name: 'Premier Fantasy Masters 2023',
        position: 1,
        points: 450,
        season: '2023/24',
        status: 'completed',
    },
    {
        id: '2',
        name: 'La Liga Fantasy Elite',
        position: 3,
        points: 380,
        season: '2023/24',
        status: 'active',
    },
    {
        id: '3',
        name: 'Bundesliga Fantasy Cup',
        position: 5,
        points: 420,
        season: '2023/24',
        status: 'completed',
    },
]

interface UserTabProps {
    session: AuthSession | null
    activeSessions: Session[]
    profileUser: User
    isOwnProfile: boolean
}

export function UserTab({ session, activeSessions, profileUser, isOwnProfile }: UserTabProps) {
    const { data } = authClient.useSession()
    const currentSession = data || session

    const [emailVerificationPending, setEmailVerificationPending] = useState<boolean>(false)
    const [isReportDialogOpen, setIsReportDialogOpen] = useState<boolean>(false);

    return (
        <TabsContent value="overview" className="space-y-6">
            {session?.user.emailVerified ? null : (
                <Alert>
                    <AlertTitle>Verify Your Email Address</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                        {
                            "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend."
                        }
                        <Button
                            size="sm"
                            variant="secondary"
                            className="mt-2"
                            onClick={async () => {
                                await authClient.sendVerificationEmail(
                                    {
                                        email: session?.user.email || '',
                                        callbackURL: '/dashboard/profile',
                                    },
                                    {
                                        onRequest() {
                                            setEmailVerificationPending(true)
                                        },
                                        onError(context) {
                                            toast.error(context.error.message)
                                            setEmailVerificationPending(false)
                                        },
                                        onSuccess() {
                                            toast.success('Verification email sent successfully')
                                            setEmailVerificationPending(false)
                                        },
                                    },
                                )
                            }}
                        >
                            {emailVerificationPending ? (
                                <Loader2Icon size={15} className="animate-spin" />
                            ) : (
                                'Resend Verification Email'
                            )}
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>View user profile information</CardDescription>
                    </div>
                    {isOwnProfile ? (
                        <div className="flex flex-row gap-1">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/dashboard/profile/edit">
                                    <PencilIcon className="mr-2 h-4 w-4" /> 
                                    Edit Profile
                                </Link>
                            </Button>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled>
                                            Delete Account
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Coming soon</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" aria-label="More options">
                                        <MoreHorizontalIcon className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                                        <FlagIcon className="mr-2 h-4 w-4 text-red-600" />
                                        <span className='text-red-600'>Report User</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="flex flex-col gap-6 md:flex-row">
                    <div className="flex flex-col items-center gap-4 md:w-1/3">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={profileUser.image || ''} alt={profileUser.name} />
                            <AvatarFallback>{profileUser.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="text-xl font-bold">{profileUser.name}</h3>
                            <p className="text-muted-foreground text-sm">{profileUser.username || profileUser.id}</p>
                            <div className="mt-2 flex justify-center gap-2">
                                <Badge
                                    variant={'outline'}
                                    className={cn(profileUser.role === 'admin' && 'bg-indigo-700', 'text-white')}
                                >
                                    {profileUser.role?.toLocaleUpperCase()}
                                </Badge>
                                {profileUser.banned && <Badge variant="destructive">Banned</Badge>}
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <div className="space-y-4">
                            {isOwnProfile && (
                                <div>
                                    <h4 className="mb-2 font-medium">Email</h4>
                                    <p className="text-muted-foreground">{profileUser.email}</p>
                                </div>
                            )}
                            <div>
                                <h4 className="mb-2 font-medium">Member Since</h4>
                                <p className="text-muted-foreground">
                                    {profileUser.createdAt
                                        ? new Date(profileUser.createdAt).toLocaleDateString()
                                        : 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-2 font-medium">Last Login</h4>
                                <p className="text-muted-foreground">
                                    {profileUser.lastLogin
                                        ? formatDistanceToNow(new Date(profileUser.lastLogin), { addSuffix: true })
                                        : 'Unknown'}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Current Leagues</CardTitle>
                    <CardDescription>Active leagues this user is participating in</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockLeagues
                            .filter((league) => league.status === 'active')
                            .map((league) => (
                                <div
                                    key={league.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{league.name}</span>
                                            <Badge variant="default">{league.status}</Badge>
                                        </div>
                                        <div className="text-muted-foreground text-sm">Season: {league.season}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="font-medium">Position: {league.position}</div>
                                            <div className="text-muted-foreground text-sm">{league.points} points</div>
                                        </div>
                                        {league.position === 1 && <TrophyIcon className="h-5 w-5 text-yellow-500" />}
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* TODO: Allow admins to view all users active sessions */}
            {isOwnProfile && currentSession && (
                <Card>
                    <CardHeader>
                        <CardTitle>Active Sessions</CardTitle>
                        <CardDescription>Manage your active login sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActiveSessionsList
                            activeSessions={activeSessions}
                            currentSessionId={currentSession.session.id}
                        />
                    </CardContent>
                </Card>
            )}

            <ReportUserDialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen} reportedUser={profileUser}/>
        </TabsContent>
    )
}
