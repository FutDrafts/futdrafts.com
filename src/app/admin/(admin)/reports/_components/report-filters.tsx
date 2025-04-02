'use client'

import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ReportFiltersProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    typeFilter: string
    setTypeFilter: (type: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void
}

export function ReportFilters({
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
}: ReportFiltersProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 md:max-w-sm">
                    <SearchIcon className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                    <Input
                        placeholder="Search reports..."
                        disabled
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="harassment">Harassment</SelectItem>
                        <SelectItem value="spam">Spam</SelectItem>
                        <SelectItem value="inappropriate_behavior">Inappropriate Behavior</SelectItem>
                        <SelectItem value="hate_speech">Hate Speech</SelectItem>
                        <SelectItem value="cheating">Cheating</SelectItem>
                        <SelectItem value="impersonation">Impersonation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
