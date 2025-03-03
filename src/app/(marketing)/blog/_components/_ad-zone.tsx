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
        <div className={`bg-muted/30 w-full rounded-lg border ${sizeClasses[size]} ${className}`}>
            <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground text-sm">Advertisement</p>
            </div>
        </div>
    )
}
