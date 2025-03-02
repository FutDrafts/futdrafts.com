'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { joinWaitlist, WaitlistFormData } from '@/actions/waitlist'

// Define schema for validation
const waitlistSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
})

export function BetaSignupForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)

    const form = useForm<WaitlistFormData>({
        resolver: zodResolver(waitlistSchema),
        defaultValues: {
            email: '',
        },
    })

    async function onSubmit(data: WaitlistFormData) {
        setIsSubmitting(true)

        try {
            const result = await joinWaitlist(data)

            if (result.success) {
                setSuccess(true)
                form.reset()
                toast.success("You've been added to our waitlist!")
            } else {
                form.setError('email', {
                    type: 'manual',
                    message: result.error,
                })
            }
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto mt-16 max-w-md" id="waitlist">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
                <h3 className="mb-4 text-xl font-semibold">Join the Beta</h3>
                <p className="text-muted-foreground mb-6">
                    Sign up to get early access to FutDrafts and help shape the future of the platform.
                </p>

                {success ? (
                    <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            {`Thanks for joining our waitlist! We'll be in touch soon.`}
                        </p>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Enter your email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    'Join Waitlist'
                                )}
                            </Button>
                        </form>
                    </Form>
                )}

                <p className="text-muted-foreground mt-4 text-xs">{`We'll never share your email with anyone else.`}</p>
            </div>
        </div>
    )
}
