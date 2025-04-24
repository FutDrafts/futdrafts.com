import * as React from 'react'
import { Heading, Text, Button, Hr } from '@react-email/components'
import BaseTemplate, { STYLES, COLORS } from './base'

export default function WaitlistLaunchNotification() {
    return (
        <BaseTemplate previewText="FutDrafts is now available!">
            <Heading style={STYLES.heading}>FutDrafts is Now Live!</Heading>

            <Text style={STYLES.text}>
                Great news! FutDrafts is now available and your account is ready to be created.
            </Text>

            <Text style={STYLES.text}>
                Thank you for your patience while we&apos;ve been building the ultimate fantasy soccer experience.
                You&apos;re among the first to get access to our platform.
            </Text>

            <Button
                href="https://futdrafts.com/auth/sign-up"
                style={{
                    ...STYLES.button,
                    backgroundColor: COLORS.accent,
                    color: 'white',
                }}
            >
                Create Your Account
            </Button>

            <Text style={STYLES.text}>Here&apos;s what you can do on FutDrafts:</Text>

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
                If you have any questions, feel free to reach out to our support team at futdrafts@alastisolutions.org
            </Text>
        </BaseTemplate>
    )
}
