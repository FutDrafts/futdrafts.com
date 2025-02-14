import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { MARKETING_FOOTER_LINKS } from '@/lib/constants'
import Link from 'next/link'

export function MarketingFooter() {
 const currentYear = new Date().getFullYear() || '2025'

    return (
        <footer className="mt-24 border-t border-primary/10 bg-secondary/5 py-16 dark:border-primary/5 dark:bg-secondary/[0.02]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mobile Footer with Accordion */}
                    <div className="sm:hidden">
                        <Accordion type="single" collapsible className="w-full">
                            {Object.entries(MARKETING_FOOTER_LINKS).map(([category, links]) => (
                                <AccordionItem value={category} key={category}>
                                    <AccordionTrigger className="text-lg font-semibold">{category}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            {links.map((link) => (
                                                <li key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        className="block py-2 transition hover:text-primary"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    {/* Desktop Footer with Grid */}
                    <div className="hidden gap-8 sm:grid sm:grid-cols-3 lg:grid-cols-4">
                        {Object.entries(MARKETING_FOOTER_LINKS).map(([category, links], index) => (
                            <div
                                key={category}
                                className="animate-fade-up space-y-4"
                                style={{ animationDelay: `${1800 + index * 200}ms` }}
                            >
                                <h4 className="text-lg font-semibold">{category}</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {links.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="transition hover:text-primary">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="animate-fade-up mt-16 border-t border-primary/10 pt-8 text-center text-sm text-muted-foreground [animation-delay:2600ms]">
                        <p>© {currentYear} FutDrafts. All rights reserved.</p>
                    </div>
                </div>
            </footer>
    )
}