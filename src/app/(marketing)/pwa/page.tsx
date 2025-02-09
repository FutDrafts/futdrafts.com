import { InstallPrompt } from '@/components/pwa/install-prompt'
import { NotificationManager } from '@/components/pwa/notification-manager'

export default function PWAInstallPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <NotificationManager />
            <InstallPrompt />
        </div>
    )
}
