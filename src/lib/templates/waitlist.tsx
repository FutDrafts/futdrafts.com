import * as React from 'react'
import { Heading, Text, Link, Hr } from '@react-email/components'
import BaseTemplate, { STYLES, COLORS } from './base'

interface Props {
    estimatedLaunchDate?: string
}

export default function WaitlistConfirmation({ estimatedLaunchDate }: Props) {
    return (
        <BaseTemplate previewText="You're on the FutDrafts waitlist!">
            <Heading style={STYLES.heading}>You&apos;re on the Waitlist!</Heading>
            <Text style={STYLES.text}>
                Thanks for your interest in FutDrafts! We&apos;ve added your email to our waitlist.
            </Text>

            <Text style={STYLES.text}>
                We&apos;re working hard to build the ultimate fantasy soccer experience. When we&apos;re ready to launch
                {estimatedLaunchDate ? ` (estimated: ${estimatedLaunchDate})` : ''}, we&apos;ll send you an invitation
                to create your account and start building your dream team.
            </Text>
            <Text style={STYLES.text}>In the meantime, here&apos;s what you can expect from FutDrafts!</Text>

            <ul>
                <li style={{ ...STYLES.text, marginBottom: '8px' }}>
                    <span style={{ color: COLORS.accentLight }}>•</span> Create and manage your dream soccer team
                </li>
                <li style={{ ...STYLES.text, marginBottom: '8px' }}>
                    <span style={{ color: COLORS.accentLight }}>•</span> Compete in private leagues with friends
                </li>
                <li style={{ ...STYLES.text, marginBottom: '8px' }}>
                    <span style={{ color: COLORS.accentLight }}>•</span> Track live performance and score
                </li>
            </ul>

            <Hr style={STYLES.hr} />

            <Text style={{ ...STYLES.text, fontSize: '14px', marginTop: '16px' }}>
                Follow us for updates{' '}
                <Link href="https://github.com/FutDrafts" style={{ ...STYLES.link, marginLeft: '8px' }}>
                    GitHub
                </Link>
            </Text>
        </BaseTemplate>
    )
}
