export default async function TestRequestPage() {
    async function getData() {
        'use server'

        const token = await fetch('/api/auth/token')

        const data = await fetch('http://localhost:80/private', {
            method: 'GET',
            credentials: 'include',
            mode: 'cors',
            referrer: 'http://localhost:3000/pwa/request',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        return { ...data }
    }

    const data = await getData()

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <p>{data ? JSON.stringify(data) : 'Request probably failed'}</p>
        </div>
    )
}
