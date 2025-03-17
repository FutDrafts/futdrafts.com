import * as React from 'react'
import { Heading, Text, Link, Section } from '@react-email/components'
import BaseTemplate, { COLORS, STYLES } from './base'

interface Props {
    username: string
    deadlineTime: string
    deadlineDate: string
    teamLink: string
    matchday: string
}

export default function DeadlineReminderTemplate({ username, deadlineTime, deadlineDate, teamLink, matchday }: Props) {
    return (
        <BaseTemplate previewText={`Draft ${matchday} deadline reminder`}>
            <Heading style={STYLES.heading}>Team Selection Deadline Approaching!</Heading>
            <Text style={STYLES.text}>Hi {username},</Text>
            <Text style={STYLES.text}>
                This is a friendly that the deadline for Matchday {matchday} team selection is approaching:
            </Text>
            <Section style={{ textAlign: 'center', margin: '20px 0' }}>
                <Text
                    style={{
                        ...STYLES.text,
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: STYLES.link.color,
                        marginBottom: '0',
                    }}
                >
                    {deadlineDate}
                </Text>
                <Text
                    style={{
                        ...STYLES.text,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: STYLES.link.color,
                        marginTop: '4px',
                    }}
                >
                    {deadlineTime}
                </Text>
            </Section>
            <Text style={STYLES.text}>
                Make sure to review your team, check for injuries, and make any necessary swaps before the deadline to
                maximize your profits.
            </Text>
            <Section style={{ textAlign: 'center' }}>
                <Link href={teamLink} style={STYLES.button}>
                    Join the Draft
                </Link>
            </Section>
            <Text style={{ ...STYLES.text, fontSize: '14px', color: COLORS.secondaryText }}>
                Top tip: Check the latest injury news and predicted lineups before finalizing your team.
            </Text>
        </BaseTemplate>
    )
}
