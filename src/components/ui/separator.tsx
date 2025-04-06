'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/lib/utils'

function Separator({
    className,
    orientation = 'horizontal',
    decorative = true,
    ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
    return (
        <SeparatorPrimitive.Root
            data-slot="separator-root"
            decorative={decorative}
            orientation={orientation}
            className={cn(
                'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
                className,
            )}
            {...props}
        />
    )
}

interface SeparatorWithTextProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string
    className?: string
    lineClassName?: string
}

function SeparatorWithText({ text, className, lineClassName, ...props }: SeparatorWithTextProps) {
    return (
        <div className={cn('relative flex items-center py-4', className)} {...props}>
            <div className={cn('flex-grow border-t border-gray-200 dark:border-gray-700', lineClassName)} />
            <span className="mx-4 flex-shrink text-sm text-gray-500 dark:text-gray-400">{text}</span>
            <div className={cn('flex-grow border-t border-gray-200 dark:border-gray-700', lineClassName)} />
        </div>
    )
}

export { Separator, SeparatorWithText }
