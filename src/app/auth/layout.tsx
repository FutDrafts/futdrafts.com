export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="flex h-screen flex-col items-center justify-center">{children}</div>
}
