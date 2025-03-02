export default function PolicyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
                    <p className="text-sm">
                        <strong>Note:</strong>{' '}
                        {`These policy documents were generated with the assistance of AI technology. 
            While we've reviewed the content for accuracy, please contact us if you have any questions or concerns 
            about our policies.`}
                    </p>
                </div>

                <div className="space-y-6 text-pretty">{children}</div>
            </div>
        </div>
    )
}
