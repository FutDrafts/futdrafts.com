'use client'

import { useState, useEffect, use } from 'react'
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
import { updateChangelogEntry, getAllChangelogEntries } from '@/actions/changelog'
import { changelogSchema, ChangelogFormData } from '@/app/admin/(admin)/changelog/new/page'

export default function EditChangelogEntryPage({ params }: { params: Promise<{ id: string }> }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { id } = use(params)

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

    useEffect(() => {
        async function loadChangelogEntry() {
            try {
                const entries = await getAllChangelogEntries()
                const entry = entries.find((e) => e.id === id)

                if (!entry) {
                    toast.error('Changelog entry not found')
                    router.push('/admin/changelog')
                    return
                }

                form.reset({
                    title: entry.title,
                    description: entry.description,
                    version: entry.version || '',
                    important: entry.important || false,
                    published: entry.published || false,
                })
            } catch (error) {
                console.error('Error loading changelog entry:', error)
                toast.error('Failed to load changelog entry')
            } finally {
                setIsLoading(false)
            }
        }

        loadChangelogEntry()
    }, [id, router, form])

    async function onSubmit(data: ChangelogFormData) {
        setIsSubmitting(true)

        try {
            await updateChangelogEntry(id, data)
            toast.success('Changelog entry updated successfully')
            router.push('/admin/changelog')
        } catch (error) {
            console.error('Error updating changelog entry:', error)
            toast.error('Failed to update changelog entry')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Changelog Entry</h1>
                <p className="text-muted-foreground">Update an existing changelog entry</p>
            </div>

            <Card>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle>Changelog Details</CardTitle>
                            <CardDescription>Edit the details of your changelog entry</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                            <Textarea className="min-h-32" {...field} />
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
                                            <Input {...field} />
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
                                                <FormLabel>Publish</FormLabel>
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
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
