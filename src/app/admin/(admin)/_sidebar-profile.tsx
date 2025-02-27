'use client'

import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogOutIcon, UsersIcon } from 'lucide-react'
import ThemeSwitcher from '@/components/theme-switcher'

interface Props {
    user: {
        name: string
        profileImage: string | undefined
        role: string
    }
}

export function AdminSidebarProfile({ user }: Props) {
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
        <div className="flex flex-row gap-1 border-t p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={'flex w-full items-center gap-2 px-2'}>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profileImage} alt={user.name} />
                            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-1 flex-col items-start text-sm">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-muted-foreground text-xs">{user.role.toLocaleUpperCase()}</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile">
                            <UsersIcon className="mr-2 h-4 w-4" />
                            Profile Settings
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ThemeSwitcher />
        </div>
    )
}
