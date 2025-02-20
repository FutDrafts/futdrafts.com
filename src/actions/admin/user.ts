import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getLimitedUserInfo() {
    'use server'

    const data = await auth.api.getSession({
        headers: await headers(),
    })

    if (!data?.session || !data.user) {
        redirect('/auth/sign-in')
    }

    const { user } = data
    const { name, role, image } = user

    return {
        name,
        role: role ?? 'User',
        profileImage: image ?? undefined,
    }
}
