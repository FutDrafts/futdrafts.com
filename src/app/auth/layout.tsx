import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const [session] = await Promise.all([
        await auth.api.getSession({
            headers: await headers()
        })
    ]).catch(() => redirect("/auth/sign-ing"))

    if(session) {
        redirect("/dashboard")
    }
    
    return <div className="flex h-screen flex-col items-center justify-center">{children}</div>
}
