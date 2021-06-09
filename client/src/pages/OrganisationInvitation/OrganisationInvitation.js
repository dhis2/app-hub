import { useAuth0 } from '@auth0/auth0-react'
import { CenteredContent, NoticeBox, Card, Button } from '@dhis2/ui'
import jwtDecode from 'jwt-decode'
import React from 'react'
import { useQueryParams, StringParam } from 'use-query-params'
import styles from './OrganisationInvitation.module.css'

const OrganisationInvitation = () => {
    const [queryParams] = useQueryParams({
        invitationToken: StringParam,
    })
    const { loginWithRedirect } = useAuth0()

    const { invitationToken } = queryParams
    const decoded = jwtDecode(invitationToken)
    if (!decoded) {
        return (
            <CenteredContent>
                <NoticeBox error>Your invitation has expired</NoticeBox>
            </CenteredContent>
        )
    }

    const handleAcceptInvitation = () => {
        loginWithRedirect({
            redirectUri: `${window.location.protocol}//${window.location.host}/verify/org/callback?invitationToken=${invitationToken}`,
        })
    }

    return (
        <Card className={styles.card}>
            <p className={styles.explanation}>
                <strong>{decoded.from.name}</strong>
                <span className={styles.middle}>
                    has invited you to join organisation
                </span>
                <strong>{decoded.organisation}</strong>
            </p>
            <Button primary onClick={handleAcceptInvitation}>
                Accept invitation
            </Button>
        </Card>
    )
}

export default OrganisationInvitation
