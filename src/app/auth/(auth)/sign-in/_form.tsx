'use client'

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'
import { GithubIcon } from '@/components/svgs/github-icon'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ForgotPasswordDialog } from '@/components/forgot-password-dialog'

const signInSchema = z.object({
    identifier: z.string().min(1, 'Email or username is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
})

export function SignInForm({ referrer }: { referrer: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setLoading(true)
        try {
            // Check if the identifier is an email or username
            const isEmail = data.identifier.includes('@')

            if (isEmail) {
                await authClient.signIn.email(
                    {
                        email: data.identifier,
                        password: data.password,
                    },
                    {
                        onSuccess() {
                            router.push(referrer)
                        },
                    },
                )
            } else {
                await authClient.signIn.username(
                    {
                        username: data.identifier,
                        password: data.password,
                    },
                    {
                        onSuccess() {
                            router.push(referrer)
                        },
                    },
                )
            }
        } catch (error) {
            console.error('Sign in error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <ForgotPasswordDialog open={open} setOpen={setOpen} />
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email or Username</FormLabel>
                            <FormControl>
                                <Input placeholder="m@example.com or username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center">
                                <FormLabel>Password</FormLabel>
                                <Button
                                    type="button"
                                    variant={'link'}
                                    onClick={() => setOpen(true)}
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Button>
                            </div>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="password"
                                    autoComplete="current-password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel>Remember me</FormLabel>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Login'}
                </Button>

                <div className={cn('flex w-full items-center gap-2', 'flex-col justify-between')}>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn('w-full gap-2')}
                        onClick={async () => {
                            await authClient.signIn.social({
                                provider: 'github',
                                callbackURL: '/dashboard',
                            })
                        }}
                    >
                        <GithubIcon />
                        Sign in with Github
                    </Button>
                </div>
            </form>
        </Form>
    )
}
