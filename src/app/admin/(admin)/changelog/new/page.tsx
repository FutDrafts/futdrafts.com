'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createChangelogEntry } from '@/actions/changelog'
import { z } from 'zod'

const changelogSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    version: z.string().optional(),
    important: z.boolean().default(false),
    published: z.boolean().default(false),
})

export type ChangelogFormData = z.infer<typeof changelogSchema>

export default function NewChangelogEntryPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const form = useForm<ChangelogFormData>({
        resolver: zodResolver(changelogSchema),
        defaultValues: {
            title: '',
            description: '',
            version: '',
            important: false,
            published: false,
        },
    })

    async function onSubmit(data: ChangelogFormData) {
        setIsSubmitting(true)

        try {
            await createChangelogEntry(data)
            toast.success('Changelog entry created successfully')
            router.push('/admin/changelog')
        } catch (error) {
            console.error('Error creating changelog entry:', error)
            toast.error('Failed to create changelog entry')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Create Changelog Entry</h1>
                <p className="text-muted-foreground">Add a new changelog entry to inform users about updates</p>
            </div>

            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle>Changelog Details</CardTitle>
                            <CardDescription>Fill in the details about your update or new feature</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="New Feature: Push Notifications" {...field} />
                                        </FormControl>
                                        <FormDescription>A concise title for the changelog entry</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the changes or new features in detail..."
                                                className="min-h-32"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a detailed explanation of what changed
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="version"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Version (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1.2.0" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The version number associated with this change
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-col gap-6 sm:flex-row">
                                <FormField
                                    control={form.control}
                                    name="important"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Mark as Important</FormLabel>
                                                <FormDescription>Highlight this as an important update</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="published"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Publish Immediately</FormLabel>
                                                <FormDescription>
                                                    Make this changelog entry visible to users
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/changelog')}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating...' : 'Create Changelog Entry'}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
