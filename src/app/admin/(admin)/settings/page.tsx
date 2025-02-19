import { getConfig } from '@/actions/admin/config'
import { ConfigForm } from './_config-form'

export default async function SettingsPage() {
    const config = await getConfig()

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">Manage your application settings and preferences.</p>
                </div>
            </div>
            <ConfigForm initialConfig={config} />
        </div>
    )
}
