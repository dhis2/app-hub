import { CenteredContent, NoticeBox, CircularLoader } from '@dhis2/ui'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useQueryParam, StringParam } from 'use-query-params'
import * as api from '../../api'
import { useSuccessAlert } from 'src/lib/use-alert'

const OrganisationInvitationCallback = () => {
    const [invitationToken] = useQueryParam('invitationToken', StringParam)
    const successAlert = useSuccessAlert()
    const [organisationId, setOrganisationId] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const acceptInvitation = async (token) => {
            try {
                const { organisation } = await api.acceptOrganisationInvitation(
                    token
                )
                setOrganisationId(organisation.id)
                successAlert.show({
                    message: `Successfully joined organisation ${organisation.name}`,
                })
            } catch (e) {
                console.error(e)
                setError(e)
            }
        }
        if (invitationToken) {
            acceptInvitation(invitationToken)
        }
    }, [])

    if (!invitationToken) {
        console.log('No invitationToken to parse, redirect to index')
        return <Redirect to="/" />
    }

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Failed to join organisation" error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!organisationId) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return <Redirect to={`/user/organisation/${organisationId}`} />
}

export default OrganisationInvitationCallback
