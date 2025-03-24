import * as React from 'react'
import { Heading, Text, Link, Section } from '@react-email/components'
import BaseTemplate, { STYLES } from './base'

interface Props {
    username: string
    verificationLink: string
    expiryHours?: number
}

export default function EmailVerificationTemplate({ username, verificationLink, expiryHours = 24 }: Props) {
    return (
        <BaseTemplate previewText="Verify you FutDrafts Account">
            <Heading style={STYLES.heading}>Verify your Email Address</Heading>
            <Text style={STYLES.text}>Hi {username},</Text>
            <Text style={STYLES.text}>
                Thanks for signing up for FutDrafts. To complete your registration and access all our features, please
                verify your email address.
            </Text>
            <Section style={{ textAlign: 'center' }}>
                <Link href={verificationLink} style={STYLES.button}>
                    Verify Your Email Address
                </Link>
            </Section>
            <Text style={STYLES.text}>
                This verification link will expire in {expiryHours} minutes. If you didn&apos;t create an account, you
                can safely ignore this email.
            </Text>
            <Text style={STYLES.text}>
                If the button above doesn&apos;t work, copy and pate this link into your browser:
            </Text>
            <Text style={{ ...STYLES.text, color: STYLES.link.color }}>{verificationLink}</Text>
        </BaseTemplate>
    )
}
