import * as React from 'react'
import { Heading, Text, Link, Section } from '@react-email/components'
import BaseTemplate, { STYLES } from './base'

interface Props {
    username: string
    loginLink: string
    guideLink?: string
}

export default function WelcomeTemplate({
    username,
    loginLink = 'https://futdrafts.com/auth/sign-in',
    guideLink = 'https://futdrafts.com/blog/getting-started',
}: Props) {
    return (
        <BaseTemplate previewText="Welcome to FutDrafts!">
            <Heading style={STYLES.heading}>Welcome to FutDrafts!</Heading>
            <Text style={STYLES.text}>Hi {username},</Text>
            <Text style={STYLES.text}>
                Thank you for joining FutDrafts! We&apos;re excited to have you on board. Your account is now active and
                ready to use.
            </Text>
            <Text style={STYLES.text}>With FutDrafts, you can:</Text>
            <ul>
                <li style={{ ...STYLES.text, marginBottom: '8px' }}>Create and Manage your dream team</li>
                <li style={{ ...STYLES.text, marginBottom: '8px' }}>Compete in leagues with friends and others</li>
                <li style={{ ...STYLES.text, marginBottom: '8px' }}>Track live scores and player performances</li>
            </ul>
            <Section style={{ textAlign: 'center' }}>
                <Link href={loginLink} style={STYLES.button}>
                    Log In to your Account
                </Link>
            </Section>
            <Text style={STYLES.text}>
                Need help getting started? Check out our{' '}
                <Link href={guideLink} style={STYLES.link}>
                    beginner&apos;s guide
                </Link>{' '}
                for tips on how to get started on FutDrafts
            </Text>
        </BaseTemplate>
    )
}
