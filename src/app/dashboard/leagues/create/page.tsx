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

const competitions = [
    { label: 'Premier League', value: 'premier-league' },
    { label: 'La Liga', value: 'la-liga' },
    { label: 'Bundesliga', value: 'bundesliga' },
    { label: 'Serie A', value: 'serie-a' },
    { label: 'UEFA Champions League', value: 'uefa-champions-league' },
]

const formSchema = z.object({
    name: z.string().min(3, 'League name must be at least 3 characters'),
    description: z.string().optional(),
    leagueId: z.string().min(1, 'Please select a league'),
    scoreRulesId: z.string().min(1, 'Please select scoring rules'),
    status: z.enum(['pending', 'active', 'ended', 'cancelled']).default('pending'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    joinCode: z.string().min(6, 'Join code must be at least 6 characters'),
    minPlayer: z.number().min(2, 'Minimum players must be at least 2').max(8, 'Minimum players cannot exceed 8'),
    maxPlayer: z.number().min(2, 'Maximum players must be at least 2').max(8, 'Maximum players cannot exceed 8'),
    isPrivate: z.boolean().default(false),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    draftStart: z.date().optional(),
})

export default function CreateLeaguePage() {
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            leagueId: '',
            scoreRulesId: '',
            status: 'pending',
            slug: '',
            joinCode: generateLeagueCode(),
            minPlayer: 2,
            maxPlayer: 8,
            isPrivate: false,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        try {
            console.log(values)
            // TODO: Implement league creation API call
            // await createLeague(values)
            // router.push(`/dashboard/leagues/${values.slug}`)
        } catch (error) {
            console.error('Failed to create league:', error)
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
                                                        <Input placeholder="Enter league name" {...field} />
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
                                                            options={competitions}
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

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="minPlayer"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Minimum Players</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="2"
                                                                max="8"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(parseInt(e.target.value))
                                                                }
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
                                                        <FormLabel>Maximum Players</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="2"
                                                                max="8"
                                                                {...field}
                                                                onChange={(e) =>
                                                                    field.onChange(parseInt(e.target.value))
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
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
                                                startDate={field.value}
                                                endDate={form.getValues('endDate')}
                                                onStartDateChange={field.onChange}
                                                onEndDateChange={(date) => form.setValue('endDate', date)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Select the start and end dates and times for your league
                                        </FormDescription>
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
