'use client'

import { TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { EditIcon, SaveIcon, TrophyIcon, XIcon, MedalIcon, StarIcon, CameraIcon, Loader2Icon } from 'lucide-react'
import { AuthSession } from '@/lib/types'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { ActiveSessionsList } from './_active-sessions-list'

const mockStats = {
    leaguesJoined: 12,
    leaguesWon: 3,
    totalPoints: 1250,
    averageRank: 4.2,
    winRate: '25%',
}

interface Props {
    session: AuthSession | null
    activeSessions: AuthSession['session'][]
}

export function UserTab(props: Props) {
    const { data } = authClient.useSession()
    const session = data || props.session

    const [emailVerificationPending, setEmailVerificationPending] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState(false)
    const [newAvatar, setNewAvatar] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [user, setUser] = useState({
        name: session?.user.name,
        image: session?.user.image,
    })

    const handleSave = async () => {
        try {
            // Create form data if we have a new avatar
            let imageUrl = user.image

            if (newAvatar) {
                const formData = new FormData()
                formData.append('file', newAvatar)

                // Upload the avatar first
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload avatar')
                }

                const uploadData = await uploadResponse.json()
                imageUrl = uploadData.url
            }

            // Update user profile with better-auth
            const response = await authClient.updateUser({
                name: user.name,
                image: imageUrl,
            })

            if (response.error) {
                throw new Error(response.error.message)
            }

            // Reset state
            setNewAvatar(null)
            setAvatarPreview(null)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
            // You might want to show an error message to the user here
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewAvatar(file)

            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file)
            setAvatarPreview(previewUrl)

            // Update the user state with the preview
            setUser((prev) => ({
                ...prev,
                image: previewUrl,
            }))

            // Clean up the object URL when component unmounts or when preview changes
            return () => URL.revokeObjectURL(previewUrl)
        }
    }

    return (
        <>
            <TabsContent value="overview" className="space-y-6">
                {session?.user.emailVerified ? null : (
                    <Alert>
                        <AlertTitle>Verify Your Email Address</AlertTitle>
                        <AlertDescription className="text-muted-foreground">
                            {
                                "Please verify your email address. Check your inbox for the verification email. If you haven't received the email, click the button below to resend."
                            }
                        </AlertDescription>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="mt-2"
                            onClick={async () => {
                                await authClient.sendVerificationEmail(
                                    {
                                        email: session?.user.email || '',
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
                    </Alert>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your profile details and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage
                                            src={avatarPreview || user.image || undefined}
                                            alt={user.name || ''}
                                        />
                                        <AvatarFallback>{user.name?.slice(0, 2) || ''}</AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <div className="absolute right-0 bottom-0">
                                            <Label htmlFor="avatar" className="cursor-pointer">
                                                <div className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-1.5">
                                                    <CameraIcon className="h-4 w-4" />
                                                </div>
                                            </Label>
                                            <Input
                                                id="avatar"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                    )}
                                </div>
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} variant={'outline'}>
                                        <EditIcon className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex flex-col justify-between gap-2 md:justify-start">
                                        <Button variant="destructive" onClick={() => setIsEditing(false)}>
                                            <XIcon className="mr-2 h-4 w-4" />
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave}>
                                            <SaveIcon className="mr-2 h-4 w-4" />
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={user.name}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" value={session?.user.email} disabled />
                                    </div>
                                    {session?.user.createdAt && (
                                        <div className="space-y-2">
                                            <Label>Join Date</Label>
                                            <Input
                                                value={new Date(session?.user.createdAt).toLocaleDateString()}
                                                disabled
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Leagues Joined</CardTitle>
                            <TrophyIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.leaguesJoined}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Leagues Won</CardTitle>
                            <MedalIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.leaguesWon}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                            <StarIcon className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.winRate}</div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{`Active Sessions: ${props.activeSessions.length}`}</CardTitle>
                        <CardDescription>{'Your Current Session will say "Sign Out"'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActiveSessionsList
                            activeSessions={props.activeSessions}
                            currentSessionId={props.session?.session.id}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </>
    )
}
