import { getConfig } from '@/lib/config'
import SettingsPage from './page'

export default async function SettingsLayout() {
    const config = await getConfig()

    return <SettingsPage initialConfig={config} />
}
