'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

const emailSchema = z.object({
    email: z.string().email('Please enter a valid email'),
})

type EmailFormValues = z.infer<typeof emailSchema>

export function ForgotPasswordDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
    const [loading, setLoading] = useState(false)

    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: EmailFormValues) => {
        setLoading(true)
        try {
            await authClient.forgetPassword({
                email: data.email,
                redirectTo: '/auth/reset-password',
            })
            setOpen(false)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enter your email</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Reset Password'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
