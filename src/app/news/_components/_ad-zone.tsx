interface AdZoneProps {
    className?: string
    size?: 'small' | 'medium' | 'large'
}

export function AdZone({ className = '', size = 'medium' }: AdZoneProps) {
    const sizeClasses = {
        small: 'h-[120px]',
        medium: 'h-[250px]',
        large: 'h-[400px]',
    }

    return (
        <div className={`w-full rounded-lg border bg-muted/30 ${sizeClasses[size]} ${className}`}>
            <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">Advertisement</p>
            </div>
        </div>
    )
}
