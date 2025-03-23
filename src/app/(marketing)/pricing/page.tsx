import { CheckIcon } from 'lucide-react'

export default function PricingPage() {
    return (
        <div className="relative container py-20">
            {/* Beta Notice */}
            <div className="mb-16 flex justify-center">
                <div className="bg-muted flex items-center space-x-2 rounded-lg px-4 py-2">
                    <div className="bg-primary h-1.5 w-1.5 rounded-full"></div>
                    <p className="text-muted-foreground text-sm">Beta Pricing</p>
                </div>
            </div>

            {/* Header */}
            <div className="mx-auto mb-16 max-w-[540px] text-center">
                <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">Simple pricing</h1>
                <p className="text-muted-foreground">Start with our free tier and upgrade when you&apos;re ready</p>
            </div>

            {/* Pricing Grid */}
            <div className="mx-auto grid max-w-screen-lg gap-6 md:grid-cols-2">
                {/* Free Plan */}
                <div className="bg-card rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <h3 className="font-medium">Free</h3>
                            <p className="text-muted-foreground mt-1 text-sm">Get started with the basics</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">$0</div>
                            <div className="text-muted-foreground text-sm">/month</div>
                        </div>
                    </div>

                    <ul className="my-6 space-y-4 text-sm">
                        <li className="flex gap-4">
                            <CheckIcon className="size-4" />
                            <span>Basic draft simulations</span>
                        </li>
                        <li className="flex gap-4">
                            <CheckIcon className="size-4" />
                            <span>Community access</span>
                        </li>
                        <li className="flex gap-4">
                            <CheckIcon className="size-4" />
                            <span>Basic player statistics</span>
                        </li>
                    </ul>

                    <button className="bg-background hover:bg-muted w-full rounded-lg border px-4 py-2 text-sm font-medium transition-colors">
                        Get started
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="border-primary bg-card relative rounded-xl border-2 p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="bg-primary text-primary-foreground absolute -top-[1px] -right-[1px] rounded-tr-xl rounded-bl-xl px-3 py-1 text-xs font-medium">
                        Popular
                    </div>

                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <h3 className="font-medium">Pro</h3>
                            <p className="text-muted-foreground mt-1 text-sm">For serious drafters</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">$20</div>
                            <div className="text-muted-foreground text-sm">/month</div>
                        </div>
                    </div>

                    <ul className="my-6 space-y-4 text-sm">
                        <li className="flex gap-4">
                            <CheckIcon className="size-4" />
                            <span>Everything in Free</span>
                        </li>
                        <li className="flex gap-4">
                            <CheckIcon className="size-4" />
                            <span>Advanced draft analytics</span>
                        </li>
                        <li className="flex gap-4">
                            <CheckIcon className="size-4" />
                            <span>Priority support</span>
                        </li>
                        <li className="flex gap-4">
                            <CheckIcon className="size-4" />
                            <span>Custom draft strategies</span>
                        </li>
                    </ul>

                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </div>
    )
}
