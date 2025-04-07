'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DateTimePickerProps {
    date?: Date
    onDateChange?: (date: Date | undefined) => void
    placeholder?: string
    className?: string
}

export function DateTimePicker({ date, onDateChange, className }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
    const [selectedTime, setSelectedTime] = React.useState<string>(date ? format(date, 'HH:mm') : '00:00')

    // Generate time options in 15-minute increments
    const timeOptions = React.useMemo(() => {
        const options = []
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                options.push(time)
            }
        }
        return options
    }, [])

    const handleDateChange = (newDate: Date | undefined) => {
        setSelectedDate(newDate)
        if (newDate && selectedTime) {
            const [hours, minutes] = selectedTime.split(':').map(Number)
            const updatedDate = new Date(newDate)
            updatedDate.setHours(hours, minutes)
            onDateChange?.(updatedDate)
        } else {
            onDateChange?.(newDate)
        }
    }

    const handleTimeChange = (newTime: string) => {
        setSelectedTime(newTime)
        if (selectedDate) {
            const [hours, minutes] = newTime.split(':').map(Number)
            const updatedDate = new Date(selectedDate)
            updatedDate.setHours(hours, minutes)
            onDateChange?.(updatedDate)
        }
    }

    return (
        <div className={cn('flex gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !selectedDate && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
                </PopoverContent>
            </Popover>
            <Select value={selectedTime} onValueChange={handleTimeChange}>
                <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Select time">
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            {selectedTime}
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                            {time}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
