'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function SearchBar() {
    return (
        <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input placeholder="Search blog posts..." className="w-full pl-8" />
        </div>
    )
}
