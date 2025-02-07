import { InstallPrompt } from "@/components/pwa/install-prompt";
import { NotificationManager } from "@/components/pwa/notification-manager";

export default function PWAInstallPage() {
    return (
        <div>
            <NotificationManager />
            <InstallPrompt/>
        </div>
    )
}