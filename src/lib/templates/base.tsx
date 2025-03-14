import * as React from 'react'
import { Html, Body, Head, Container, Preview, Section, Text, Link, Hr, Img } from '@react-email/components'

const COLORS = {
    background: '#121212',
    cardBackground: '#1E1E1E',
    text: '#E0E0E0',
    secondaryText: '#A0A0A0',
    accent: '#6366F1',
    accentLight: '#818CF8',
    accentDark: '#4F46E5',
}

const STYLES = {
    body: {
        backgroundColor: COLORS.background,
        fontFamily: 'Arial, sans-serif',
        color: COLORS.text,
    },
    container: {
        margin: '0 auto',
        padding: '20px 0',
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: '8px',
        padding: '40px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    heading: {
        color: COLORS.text,
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '12px',
    },
    subheading: {
        color: COLORS.text,
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '8px',
    },
    text: {
        color: COLORS.text,
        fontSize: '16px',
        lineHeight: '24px',
        marginBottom: '16px',
    },
    button: {
        backgroundColor: COLORS.accent,
        borderRadius: '4px',
        color: 'white',
        display: 'inline-block',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '12px 24px',
        textDecoration: 'none',
        textAlign: 'center' as const,
        marginTop: '16px',
        marginBottom: '16px',
    },
    footer: {
        color: COLORS.secondaryText,
        fontSize: '14px',
        marginTop: '32px',
        textAlign: 'center' as const,
    },
    link: {
        color: COLORS.accentLight,
        textDecoration: 'underline',
    },
    hr: {
        borderColor: '#333',
        margin: '20px 0',
    },
    logo: {
        margin: '0 auto 20px auto',
        display: 'block',
    },
}

interface Props {
    previewText: string
    children: React.ReactNode
    footerText?: string
}

export default function BaseTemplate({
    previewText,
    children,
    footerText = '© 2025 FutDrafts. All Rights Reserved',
}: Props) {
    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={STYLES.body}>
                <Container style={STYLES.container}>
                    <Section style={STYLES.card}>
                        <Img style={STYLES.logo} width="120" height="40" alt="FutDrafts" src="" />
                        {children}
                        <Hr style={STYLES.hr} />
                        <Text style={STYLES.footer}>
                            {footerText}
                            <br />
                            <Link href="https://futdrafts.com/policies/terms" style={STYLES.link}>
                                Terms of Service
                            </Link>{' '}
                            •{' '}
                            <Link href="https://futdrafts.com/policies/privacy" style={STYLES.link}>
                                Privacy Policy
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export { COLORS, STYLES }
