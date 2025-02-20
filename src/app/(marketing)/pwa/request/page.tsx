'use client'

import { useToken } from '@/hooks/use-token'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function TestRequestPage() {
    const { token, isLoading, isError } = useToken()
    const [data, setData] = useState<unknown>()

    if (isLoading)
        <div className="flex h-screen w-screen flex-col items-center">
            <Loader2 className="animate-spin" />
        </div>
    if (isError) toast.error(isError)

    useEffect(() => {
        function getData() {
            const datas = fetch('http://localhost:80/private', {
                method: 'GET',
                credentials: 'include',
                mode: 'cors',
                referrer: 'http://localhost:3000/pwa/request',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json())

            setData(datas)
        }

        getData()
    }, [token])

    return (
        <div className="container flex h-screen flex-col items-center justify-center gap-4">
            <p className="text-xs text-wrap">{data ? JSON.stringify(data) : 'Request probably failed'}</p>
        </div>
    )
}
