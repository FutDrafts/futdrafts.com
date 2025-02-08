'use client'

import { useEffect, useState } from 'react'
import { PlusIcon, ShareIcon } from 'lucide-react'
interface WindowWithMSStream extends Window {
    MSStream?: boolean
}

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)

    useEffect(() => {
        setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as WindowWithMSStream).MSStream)
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    }, [])

    if (isStandalone) {
        return null
    }

    return (
        <div>
            <h3>Install App</h3>
            {isIOS && (
                <p>
                    To install this app on your iOS device, tap the share button
                    <span role="img" aria-label="share icon">
                        {' '}
                        <ShareIcon />{' '}
                    </span>
                    and then Add to Home Screen
                    <span role="img" aria-label="plus icon">
                        {' '}
                        <PlusIcon />{' '}
                    </span>
                    .
                </p>
            )}
        </div>
    )
}
