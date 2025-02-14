import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MobilSizeErrorPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <p className="text-2xl font-bold">Using Admin Dashboard on Mobile is not allowed!</p>
            <Button asChild variant="outline">
                <Link href="/dashboard">Redirect to Dashboard!</Link>
            </Button>
        </div>
    )
}
