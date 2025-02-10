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

// Mock settings object
const defaultSettings = {
    site: {
        name: 'FutDrafts',
        url: 'https://futdrafts.com',
        description: 'Fantasy football draft simulator',
        maintenance: false,
    },
    email: {
        provider: 'smtp',
        host: 'smtp.example.com',
        port: '587',
        username: 'user@example.com',
        password: '********',
        fromEmail: 'noreply@futdrafts.com',
        fromName: 'FutDrafts',
    },
    security: {
        twoFactorAuth: false,
        passwordMinLength: '8',
        passwordRequireSpecial: true,
        passwordRequireNumbers: true,
        maxLoginAttempts: '5',
        lockoutDuration: '30',
    },
}

export default function SettingsPage() {
    const [settings, setSettings] = useState(defaultSettings)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            // Set maintenance mode cookie
            document.cookie = `maintenance_mode=${settings.site.maintenance}; path=/`

            // Simulate API call for other settings
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Show success message (you might want to add a toast notification here)
            console.log('Settings saved successfully')
        } catch (error) {
            console.error('Failed to save settings:', error)
        } finally {
            setSaving(false)
        }
    }

    // Initialize maintenance mode from cookie on component mount
    useEffect(() => {
        const maintenanceMode =
            document.cookie
                .split('; ')
                .find((row) => row.startsWith('maintenance_mode='))
                ?.split('=')[1] === 'true'

        setSettings((prev) => ({
            ...prev,
            site: { ...prev.site, maintenance: maintenanceMode },
        }))
    }, [])

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
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="site" className="space-y-4">
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="site-name">Site Name</Label>
                                <Input
                                    id="site-name"
                                    value={settings.site.name}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            site: { ...settings.site, name: e.target.value },
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="site-url">Site URL</Label>
                                <Input
                                    id="site-url"
                                    value={settings.site.url}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            site: { ...settings.site, url: e.target.value },
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="site-description">Description</Label>
                                <Input
                                    id="site-description"
                                    value={settings.site.description}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            site: { ...settings.site, description: e.target.value },
                                        })
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
                                    checked={settings.site.maintenance}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            site: { ...settings.site, maintenance: checked },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email-provider">Email Provider</Label>
                                <Select
                                    value={settings.email.provider}
                                    onValueChange={(value) =>
                                        setSettings({
                                            ...settings,
                                            email: { ...settings.email, provider: value },
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="smtp">SMTP</SelectItem>
                                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                                        <SelectItem value="mailgun">Mailgun</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="smtp-host">SMTP Host</Label>
                                <Input
                                    id="smtp-host"
                                    value={settings.email.host}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            email: { ...settings.email, host: e.target.value },
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtp-port">SMTP Port</Label>
                                    <Input
                                        id="smtp-port"
                                        value={settings.email.port}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                email: { ...settings.email, port: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="smtp-username">SMTP Username</Label>
                                    <Input
                                        id="smtp-username"
                                        value={settings.email.username}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                email: { ...settings.email, username: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="smtp-password">SMTP Password</Label>
                                <Input
                                    id="smtp-password"
                                    type="password"
                                    value={settings.email.password}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            email: { ...settings.email, password: e.target.value },
                                        })
                                    }
                                />
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="from-email">From Email</Label>
                                    <Input
                                        id="from-email"
                                        value={settings.email.fromEmail}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                email: { ...settings.email, fromEmail: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="from-name">From Name</Label>
                                    <Input
                                        id="from-name"
                                        value={settings.email.fromName}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                email: { ...settings.email, fromName: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                                </div>
                                <Switch
                                    checked={settings.security.twoFactorAuth}
                                    onCheckedChange={(checked) =>
                                        setSettings({
                                            ...settings,
                                            security: { ...settings.security, twoFactorAuth: checked },
                                        })
                                    }
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium">Password Requirements</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="min-length">Minimum Length</Label>
                                    <Input
                                        id="min-length"
                                        type="number"
                                        min="6"
                                        value={settings.security.passwordMinLength}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                security: {
                                                    ...settings.security,
                                                    passwordMinLength: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Require Special Characters</Label>
                                    </div>
                                    <Switch
                                        checked={settings.security.passwordRequireSpecial}
                                        onCheckedChange={(checked) =>
                                            setSettings({
                                                ...settings,
                                                security: {
                                                    ...settings.security,
                                                    passwordRequireSpecial: checked,
                                                },
                                            })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Require Numbers</Label>
                                    </div>
                                    <Switch
                                        checked={settings.security.passwordRequireNumbers}
                                        onCheckedChange={(checked) =>
                                            setSettings({
                                                ...settings,
                                                security: {
                                                    ...settings.security,
                                                    passwordRequireNumbers: checked,
                                                },
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium">Login Protection</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="max-attempts">Max Login Attempts</Label>
                                        <Input
                                            id="max-attempts"
                                            type="number"
                                            min="1"
                                            value={settings.security.maxLoginAttempts}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    security: {
                                                        ...settings.security,
                                                        maxLoginAttempts: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                                        <Input
                                            id="lockout-duration"
                                            type="number"
                                            min="1"
                                            value={settings.security.lockoutDuration}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    security: {
                                                        ...settings.security,
                                                        lockoutDuration: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
