'use client'

import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'
import { LogOut, Users } from 'lucide-react'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { Session } from '@/lib/types'

interface Props {
    collapsed: boolean
    session: Session | null
}

export function ProfileButton({ collapsed, session }: Props) {
    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success('Signed out successfully', { duration: 600 })

                    setTimeout(() => {
                        redirect('/')
                    }, 500)
                },
            },
        })
    }

    return (
        <div className="border-t p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn('flex w-full items-center gap-2 px-2', collapsed && 'justify-center px-0')}
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={session?.user.image || '#'} alt={'Avatar'} />
                            <AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {!collapsed && (
                            <div className="flex flex-1 flex-col items-start text-sm">
                                <span className="font-medium">{session?.user.name}</span>
                                <span className="text-muted-foreground text-xs">{session?.user.role}</span>
                            </div>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile">
                            <Users className="mr-2 h-4 w-4" />
                            Profile Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
