'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { generateLeagueCode } from '@/lib/utils'

const competitions = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'UEFA Champions League']
const regions = ['Global', 'Europe', 'Americas', 'Asia', 'Africa']

interface FormData {
    code: string
    name: string
    description: string
    competition: string
    type: 'public' | 'private'
    region: string
    maxParticipants: number
    entryFee: number
    prizePool: number
    startDate: string
    endDate: string
    rules: string
    isInviteOnly: boolean
    inviteCode?: string
}

export default function CreateLeaguePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        code: generateLeagueCode(),
        name: '',
        description: '',
        competition: '',
        type: 'public',
        region: 'Global',
        maxParticipants: 100,
        entryFee: 0,
        prizePool: 1000,
        startDate: '',
        endDate: '',
        rules: '',
        isInviteOnly: false,
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: Implement league creation API call
            // await createLeague(formData)
            router.push(`/dashboard/leagues/${formData.code}`)
        } catch (error) {
            console.error('Failed to create league:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
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

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>League Details</CardTitle>
                        <CardDescription>Basic information about your league</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">League Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter league name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your league"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="competition">Competition</Label>
                                <Select
                                    value={formData.competition}
                                    onValueChange={(value) => setFormData({ ...formData, competition: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select competition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {competitions.map((competition) => (
                                            <SelectItem key={competition} value={competition}>
                                                {competition}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="region">Region</Label>
                                <Select
                                    value={formData.region}
                                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map((region) => (
                                            <SelectItem key={region} value={region}>
                                                {region}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>League Settings</CardTitle>
                        <CardDescription>Configure how your league will operate</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                                <Input
                                    id="maxParticipants"
                                    type="number"
                                    min="2"
                                    max="1000"
                                    value={formData.maxParticipants}
                                    onChange={(e) =>
                                        setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })
                                    }
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="entryFee">Entry Fee (Points)</Label>
                                <Input
                                    id="entryFee"
                                    type="number"
                                    min="0"
                                    value={formData.entryFee}
                                    onChange={(e) => setFormData({ ...formData, entryFee: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rules">League Rules</Label>
                            <Textarea
                                id="rules"
                                placeholder="Enter league rules and guidelines"
                                value={formData.rules}
                                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label>Private League</Label>
                                <p className="text-muted-foreground text-sm">
                                    Restrict access to invited participants only
                                </p>
                            </div>
                            <Switch
                                checked={formData.isInviteOnly}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        isInviteOnly: checked,
                                        type: checked ? 'private' : 'public',
                                    })
                                }
                            />
                        </div>

                        {formData.isInviteOnly && (
                            <div className="space-y-2">
                                <Label htmlFor="inviteCode">Invite Code</Label>
                                <Input
                                    id="inviteCode"
                                    placeholder="Enter invite code for private league"
                                    value={formData.inviteCode}
                                    onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                                />
                            </div>
                        )}
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
        </div>
    )
}
