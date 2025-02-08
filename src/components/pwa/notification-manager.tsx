'use client'

import { subscribeUser, unsubscribeUser, sendNotification } from '@/actions/pwa/notification'
import { env } from '@/env/client'
import { urlBase64ToUint8Array } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export function NotificationManager() {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])

    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/',
            updateViaCache: 'none',
        })

        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
    }

    async function subscribeToPush() {
        console.log('Subscribing to Push Notifications...')

        const registration = await navigator.serviceWorker.ready
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
        })

        setSubscription(sub)
        const serializedSub = JSON.parse(JSON.stringify(sub))
        await subscribeUser(serializedSub)
    }

    async function unsubscribeFromPush() {
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
    }

    async function sendTestNotification() {
        if (subscription) {
            await sendNotification(message || 'Hello, world!')
            setMessage(null)
        }
    }

    if (!isSupported) {
        return <p>Push Notifications are not supported on this browser.</p>
    }

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold">Push Notifications</h3>
            {subscription ? (
                <div className="flex flex-col gap-4">
                    <p>You are subscribed to push notifications.</p>
                    <button onClick={unsubscribeFromPush}>Unsubscribe</button>
                    <input
                        type="text"
                        placeholder="Enter Notification Message"
                        value={message || ''}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendTestNotification}>Send Test Notification</button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <p>You are not subscribed to push notifications.</p>
                    <Button onClick={subscribeToPush} variant={'secondary'}>
                        Subscribe
                    </Button>
                </div>
            )}
        </div>
    )
}
