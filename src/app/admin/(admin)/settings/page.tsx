'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import type { AppConfig } from '@/lib/config'

interface SettingsPageProps {
    initialConfig: AppConfig
}

export default function SettingsPage({ initialConfig }: SettingsPageProps) {
    const [config, setConfig] = useState<AppConfig>(initialConfig)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    const handleSave = async () => {
        setSaving(true)
        try {
            // Update each config value
            for (const [key, value] of Object.entries(config)) {
                await fetch('/api/admin/settings', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, value }),
                })
            }

            toast({
                title: 'Settings saved',
                description: 'Your settings have been updated successfully.',
            })
        } catch (error) {
            console.error('Failed to save settings:', error)
            toast({
                title: 'Error',
                description: 'Failed to save settings. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Manage your application settings and preferences.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                </Button>
            </div>

            <Tabs defaultValue="site" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="site">Site</TabsTrigger>
                </TabsList>

                <TabsContent value="site" className="space-y-4">
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="site-name">Site Name</Label>
                                <Input
                                    id="site-name"
                                    value={config.siteName}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            siteName: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="site-url">Site URL</Label>
                                <Input
                                    id="site-url"
                                    value={config.siteUrl}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            siteUrl: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="site-description">Description</Label>
                                <Input
                                    id="site-description"
                                    value={config.siteDescription}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            siteDescription: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Put the site into maintenance mode</p>
                                </div>
                                <Switch
                                    checked={config.maintenance}
                                    onCheckedChange={(checked) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            maintenance: checked,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
