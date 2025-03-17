import * as React from 'react'
import { Heading, Text, Link, Section } from '@react-email/components'
import BaseTemplate, { STYLES } from './base'

interface Props {
    username: string
    resetLink: string
    expiryMinutes?: number
}

export default function PasswordResetTemplate({ username, resetLink, expiryMinutes }: Props) {
    return (
        <BaseTemplate previewText="Reset your FutDrafts Account Password">
            <Heading style={STYLES.heading}>Reset your FutDrafts Password</Heading>
            <Text style={STYLES.text}>Hi {username}</Text>
            <Text style={STYLES.text}>
                We received a request to reset your password for your FutDrafts account. Click the button below to set a
                new password:
            </Text>
            <Section style={{ textAlign: 'center' }}>
                <Link href={resetLink} style={STYLES.button}>
                    Reset Password
                </Link>
            </Section>
            <Text style={STYLES.text}>
                This password reset link will expire in {expiryMinutes} minutes. If you didn&apos;t request a password
                reset, you can safely ignore this email.
            </Text>
            <Text style={STYLES.text}>
                If the button above doesn&apos;t work, copy and paste this link into your browser:
            </Text>
            <Text style={{ ...STYLES.text, color: STYLES.link.color }}>{resetLink}</Text>
        </BaseTemplate>
    )
}
