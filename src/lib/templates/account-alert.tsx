import * as React from 'react'
import { Heading, Text, Link, Section } from '@react-email/components'
import BaseTemplate, { STYLES } from './base'

interface Props {
    username: string
    alertType: 'login' | 'password_change' | 'email_change'
    timestamp: string
    location?: string
    device?: string
    ip?: string
    supportLink: string
}

export default function SecurityAlert({ username, alertType, timestamp, location, device, ip, supportLink }: Props) {
    const title = {
        login: 'New Login Detected',
        password_change: 'Password Changed',
        email_change: 'Email Address Changed',
    }[alertType]

    const description = {
        login: 'We detected a new login to your FutDrafts account.',
        password_change: 'The password for your FutDrafts account was recently changed.',
        email_change: 'The email address for you FutDrafts account was recently changed.',
    }[alertType]

    return (
        <BaseTemplate previewText={`Security Alert: ${title}`}>
            <Heading style={{ ...STYLES.heading, color: '#EF4444' }}>Security Alert: {title}</Heading>
            <Text style={STYLES.text}>Hi {username},</Text>
            <Text style={STYLES.text}>{description}</Text>

            <Section
                style={{
                    backgroundColor: 'rgba(30,30,30,0.5)',
                    borderRadius: '6px',
                    padding: '16px',
                    marginBottom: '20px',
                }}
            >
                <Text style={{ ...STYLES.text, marginBottom: '8px' }}>
                    <strong>Time: </strong> {timestamp}
                </Text>
                {location && (
                    <Text style={{ ...STYLES.text, marginBottom: '8px' }}>
                        <strong>Location:</strong> {location}
                    </Text>
                )}
                {device && (
                    <Text style={{ ...STYLES.text, marginBottom: '8px' }}>
                        <strong>Device:</strong> {device}
                    </Text>
                )}
                {ip && (
                    <Text style={{ ...STYLES.text, marginBottom: '8px' }}>
                        <strong>IP Address:</strong> {ip}
                    </Text>
                )}
            </Section>

            <Text style={{ ...STYLES.text, fontWeight: 'bold' }}>Was this you?</Text>
            <Text style={STYLES.text}>If this was you, no further action is needed.</Text>
            <Text style={{ ...STYLES.text, color: '#EF4444' }}>
                If you did not perform this action, your account may be compromised. Please take immediate action to
                secure your account:
            </Text>
            <Section style={{ textAlign: 'center' }}>
                <Link href={supportLink} style={STYLES.button}>
                    Secure My Account
                </Link>
            </Section>

            <Text style={{ ...STYLES.text, fontSize: '14px' }}>
                If you&apos;re unable to access your account, please contact our support team immediately at{' '}
                <Link href="mailto:futdrafts@alastisolutions.org" style={STYLES.link}>
                    futdrafts@alastisolutions.org
                </Link>
            </Text>
        </BaseTemplate>
    )
}
