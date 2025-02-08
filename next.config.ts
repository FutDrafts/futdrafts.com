import type { NextConfig } from 'next'
import createMdx from '@next/mdx'
import { createJiti } from 'jiti'
import { fileURLToPath } from 'node:url'

const jiti = createJiti(fileURLToPath(import.meta.url))
jiti.esmResolve('./src/env/client.ts')
jiti.esmResolve('./src/env/server.ts')

const nextConfig: NextConfig = {
    /* config options here */
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
    headers: async () => [
        {
            source: '/(.*)',
            headers: [
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'X-Frame-Options',
                    value: 'DENY',
                },
                {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin',
                },
            ],
        },
        {
            source: '/service-worker.js',
            headers: [
                {
                    key: 'Content-Type',
                    value: 'application/javascript; charset=utf-8',
                },
                {
                    key: 'Cache-Control',
                    value: 'no-cache, no-store, must-revalidate',
                },
                {
                    key: 'Content-Security-Policy',
                    value: "default-src 'self'; script-src 'self'",
                },
            ],
        },
        {
            source: '/(.*)/array/(.*)/config.js',
            headers: [
                {
                    key: 'Content-Type',
                    value: 'application/javascript; charset=utf-8',
                },
                {
                    key: 'Cache-Control',
                    value: 'no-cache, no-store, must-revalidate',
                },
                {
                    key: 'Content-Security-Policy',
                    value: "default-src 'self'; script-src 'self'",
                },
            ],
        },
    ],
}

const withMDX = createMdx({})

export default withMDX(nextConfig)
