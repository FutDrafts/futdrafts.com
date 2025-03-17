import * as React from 'react'
import { Heading, Text, Link, Section } from '@react-email/components'
import BaseTemplate, { STYLES, COLORS } from './base'

interface Props {
    username: string
    invitedBy: string
    leagueName: string
    leagueCode?: string
    joinLink: string
}

export default function LeagueInvitationTemplate({ username, invitedBy, leagueName, leagueCode, joinLink }: Props) {
    return (
        <BaseTemplate previewText={`Join ${leagueName} on FutDrafts`}>
            <Heading style={STYLES.heading}>You&apos;re invited to Join a League</Heading>
            <Text style={STYLES.text}>Hi {username},</Text>
            <Text style={STYLES.text}>
                <strong>{invitedBy}</strong> has invited you to join their league: <strong>{leagueName}</strong>
            </Text>

            {leagueCode && (
                <Section
                    style={{
                        textAlign: 'center',
                        margin: '24px 0',
                        padding: '16px',
                        backgroundColor: 'rgba(99,102,241,0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <Text
                        style={{
                            ...STYLES.text,
                            fontSize: '14px',
                            marginBottom: '4px',
                            color: COLORS.secondaryText,
                        }}
                    >
                        League Code:
                    </Text>
                    <Text
                        style={{
                            ...STYLES.text,
                            fontFamily: 'monospace',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            marginTop: '0',
                            marginBottom: '0',
                        }}
                    >
                        {leagueCode}
                    </Text>
                </Section>
            )}

            <Text style={STYLES.text}>
                Join now to compete against friends, track your progress on the league table, and havve a chance to win
                bragging rights!
            </Text>
            <Section style={{ textAlign: 'center' }}>
                <Link href={joinLink} style={STYLES.button}>
                    Join League
                </Link>
            </Section>

            <Text
                style={{
                    ...STYLES.text,
                    fontSize: '14px',
                    color: COLORS.secondaryText,
                }}
            >
                If you don&apos;t have an account yet, you&apos;ll be able to create one after clicking the join link.
            </Text>
        </BaseTemplate>
    )
}
