'use client'

import { toast } from 'sonner'
import { AppConfig } from '@/actions/admin/config'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'

export function ConfigForm({ initialConfig }: { initialConfig: AppConfig }) {
    const [config, setConfig] = useState<AppConfig>(initialConfig)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            // Update each config value
            for (const [key, value] of Object.entries(config)) {
                await fetch('/server/api/admin/settings', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, value }),
                })
            }

            toast.success('Your settings have been updated successfully.')
        } catch (error) {
            console.error('Failed to save settings:', error)
            toast.error('Failed to save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Card className="p-6">
            <CardContent>
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
                            <p className="text-muted-foreground text-sm">Put the site into maintenance mode</p>
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
            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save changes'}
                </Button>
            </CardFooter>
        </Card>
    )
}
