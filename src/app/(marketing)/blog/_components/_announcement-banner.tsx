'use client'

import { XIcon } from 'lucide-react'
import { useState } from 'react'

interface AnnouncementBannerProps {
    message: string
    link?: {
        text: string
        href: string
    }
}

export function AnnouncementBanner({ message, link }: AnnouncementBannerProps) {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-medium">
                            {message}
                            {link && (
                                <a href={link.href} className="ml-2 underline hover:no-underline">
                                    {link.text}
                                </a>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-primary-foreground/80 hover:text-primary-foreground"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
