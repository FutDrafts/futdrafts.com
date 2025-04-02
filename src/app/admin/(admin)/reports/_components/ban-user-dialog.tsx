'use client'

import { Input } from '@/components/ui/input'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { UserTable } from './types'

interface BanUserDialogProps {
    user: UserTable | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    banReason: string
    setBanReason: (reason: string) => void
    banExpiryDate: string
    setBanExpiryDate: (date: string) => void
    onBanUser: (userId: string) => void
}

export function BanUserDialog({
    user,
    isOpen,
    onOpenChange,
    banReason,
    setBanReason,
    banExpiryDate,
    setBanExpiryDate,
    onBanUser,
}: BanUserDialogProps) {
    if (!user) return null

    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{!user.banned ? 'Ban User' : 'Unban User'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {!user.banned
                            ? `Are you sure you want to ban ${user.name}? They will no longer be able to access their account.`
                            : `Are you sure you want to unban ${user.name}? They will regain access to their account.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {!user.banned && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="banReason" className="text-sm font-medium">
                                Ban Reason
                            </label>
                            <Input
                                id="banReason"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                placeholder="Enter reason for ban"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="banExpiry" className="text-sm font-medium">
                                Ban Expiry (optional)
                            </label>
                            <Input
                                id="banExpiry"
                                type="datetime-local"
                                value={banExpiryDate}
                                onChange={(e) => setBanExpiryDate(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            setBanReason('')
                            setBanExpiryDate('')
                        }}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={cn(
                            !user.banned
                                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                : 'bg-green-600 text-white hover:bg-green-600/90',
                        )}
                        onClick={() => onBanUser(user.id)}
                    >
                        {!user.banned ? 'Ban User' : 'Unban User'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
