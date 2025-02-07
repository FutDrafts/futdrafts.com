'use client';

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Button onClick={async () => await authClient.signOut()}>Sign Out</Button>
            {children}
        </div>
    )
}