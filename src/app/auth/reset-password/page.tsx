'use client'

import { useState } from 'react'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

const formSchema = z
    .object({
        password: z.string().min(8, {
            message: 'Password must be at least 8 characters.',
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

export default function ResetPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const token = searchParams.get('token')

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    })

    if (!token) {
        return redirect('/auth/sign-in')
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            const { error } = await authClient.resetPassword({
                newPassword: values.password,
                token: token as string,
            })

            if (error) {
                toast.error('Failed to reset password', { description: error.message })
            }

            setIsLoading(false)
            toast.success('Your password has been reset successfully.')
            router.push('/auth/sign-in')
        } catch (error) {
            console.error(error)
            setIsLoading(false)
            toast.error('Something went wrong. Please try again.')
        }
    }

    return (
        <div className="container mx-auto max-w-md py-8">
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-gray-500">Enter your new password below.</p>
                </div>

                {error && <div className="rounded-md bg-red-100 p-3 text-red-600">{decodeURIComponent(error)}</div>}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
