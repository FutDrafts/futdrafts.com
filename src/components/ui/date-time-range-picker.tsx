'use client'

import * as React from 'react'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { cn } from '@/lib/utils'

interface DateTimeRangePickerProps {
    startDate?: Date
    endDate?: Date
    onStartDateChange?: (date: Date | undefined) => void
    onEndDateChange?: (date: Date | undefined) => void
    placeholder?: string
    className?: string
}

export function DateTimeRangePicker({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    className,
}: DateTimeRangePickerProps) {
    return (
        <div className={cn('grid gap-2', className)}>
            <div className="grid gap-2">
                <div className="flex items-center gap-2">
                    <DateTimePicker
                        date={startDate}
                        onDateChange={onStartDateChange}
                        placeholder="Start date and time"
                    />
                    <span className="text-muted-foreground">to</span>
                    <DateTimePicker date={endDate} onDateChange={onEndDateChange} placeholder="End date and time" />
                </div>
            </div>
        </div>
    )
}
