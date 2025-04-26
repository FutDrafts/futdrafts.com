'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { fantasy } from '@/db/schema'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { joinPublicLeague, joinPrivateLeague } from '@/actions/dashboard/fantasy'
import { toast } from 'sonner'

interface Props {
    slug: string
    league: typeof fantasy.$inferSelect
    joinCode: string
}

const joinLeagueSchema = z.object({
    teamName: z.string(),
})

export function JoinForm({ slug, league, joinCode }: Props) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof joinLeagueSchema>>({
        resolver: zodResolver(joinLeagueSchema),
        defaultValues: {
            teamName: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof joinLeagueSchema>) => {
        setLoading(true)
        setError(null)

        try {
            if (league.isPrivate) {
                await joinPrivateLeague({ leagueId: league.id, joinCode, teamName: data.teamName })
            } else {
                await joinPublicLeague({ leagueId: league.id, teamName: data.teamName })
            }

            toast.success('Successfully Joined League')
            router.push(`/dashboard/leagues/${slug}`)
        } catch (error) {
            setError('Failed to join league. Please check your invite code and try again.')
            toast.error('Failed to Join League')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John's Amazing Team" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild>
                        <Link href={`/dashboard/leagues/${slug}`}>Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Joining...
                            </>
                        ) : (
                            'Join League'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
