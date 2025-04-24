'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { generateLeagueCode } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Combobox } from '@/components/ui/combobox'
import { DateTimeRangePicker } from '@/components/ui/date-time-range-picker'
import { useQuery } from '@tanstack/react-query'
import { getAllLeagueNames } from '@/actions/dashboard/leagues'
import { createFantasyLeague } from '@/actions/dashboard/fantasy'
import { toast } from 'sonner'

const formSchema = z.object({
    name: z.string().min(3, 'League name must be at least 3 characters'),
    description: z.string().optional(),
    leagueId: z.string().min(1, 'Please select a league'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    joinCode: z.string().min(6, 'Join code must be at least 6 characters'),
    minPlayer: z.number().min(2, 'Minimum players must be at least 2').max(8, 'Minimum players cannot exceed 8'),
    maxPlayer: z.number().min(2, 'Maximum players must be at least 2').max(8, 'Maximum players cannot exceed 8'),
    isPrivate: z.boolean(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    teamName: z.string(),
    status: z.enum(['pending', 'active', 'ended', 'cancelled']).optional(),
})

export default function CreateLeaguePage() {
    const [loading, setLoading] = useState(false)

    const { data, error } = useQuery({
        queryKey: ['fantasy', 'leagues', 'soccer'],
        queryFn: async () => {
            return getAllLeagueNames()
        },
    })

    if (error) {
        ;<div className="flex items-center justify-center">
            <p className="text-destructive">Error Loading Data. Please try again later</p>
        </div>
    }

    const { leagues = [] } = data || {}
    const transformedLeagues = leagues.map((league) => ({
        label: league.name,
        value: league.id,
    }))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            leagueId: '',
            slug: '',
            joinCode: generateLeagueCode(),
            minPlayer: 2,
            maxPlayer: 8,
            isPrivate: false,
            startDate: new Date(),
            endDate: new Date(),
            teamName: '',
            status: 'pending',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            // Make sure any optional fields are properly handled
            const payload = {
                ...values,
                startDate: values.startDate || new Date(),
                endDate: values.endDate || new Date(),
                status: values.status || 'pending',
            }

            const { message } = await createFantasyLeague(payload)
            toast.success(message)
        } catch (error) {
            console.error('Failed to create league:', error)
            toast.error('An error occurred while creating the league.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container max-w-3xl space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/leagues">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Create League</h1>
                    <p className="text-muted-foreground">Set up your new fantasy soccer league</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>League Details</CardTitle>
                            <CardDescription>Set up your new fantasy soccer league</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium">Basic Information</h3>
                                <div className="space-y-4">
                                    <div className="flex flex-row gap-2">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>League Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter league name"
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e.target.value)
                                                                // Auto-generate slug from league name
                                                                const slug = e.target.value
                                                                    .toLowerCase()
                                                                    .replace(/[^a-z0-9]+/g, '-')
                                                                    .replace(/^-+|-+$/g, '')
                                                                form.setValue('slug', slug)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="slug"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>URL Slug</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="league-name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="leagueId"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Competition</FormLabel>
                                                    <FormControl>
                                                        <Combobox
                                                            options={transformedLeagues}
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            placeholder="Select a competition"
                                                            emptyText="No competitions found."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="minPlayer"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Min Players</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="2"
                                                            max="8"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="maxPlayer"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Max Players</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="2"
                                                            max="8"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Describe your league" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="isPrivate"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Private League</FormLabel>
                                                    <FormDescription>
                                                        Restrict access to invited participants only
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    {form.watch('isPrivate') && (
                                        <FormField
                                            control={form.control}
                                            name="joinCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Invite Code</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter invite code for private league"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date and Time</FormLabel>
                                        <FormControl>
                                            <DateTimeRangePicker
                                                startDate={field.value || new Date()}
                                                endDate={form.getValues('endDate') || new Date()}
                                                onStartDateChange={field.onChange}
                                                onEndDateChange={(date) => form.setValue('endDate', date ?? new Date())}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Select the start and end dates and times for your league
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="teamName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Team Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"John's Amazing Team"} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/leagues">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create League'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
