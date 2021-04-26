import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useQueryParams, StringParam } from 'use-query-params'
import JWT from 'jsonwebtoken'
import { useAuth0 } from '@auth0/auth0-react'
import { acceptOrganisationInvitation } from '../../api/api'

const OrganisationInvitation = () => {
    const [queryParams] = useQueryParams({
        invitationToken: StringParam,
    })

    const { invitationToken } = queryParams
    const [invitationData, setInvitationData] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const acceptInvitation = async token => {
            try {
                const res = await acceptOrganisationInvitation(token)
                setInvitationData(res)
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
        console.error(error)
        return `Failed to join organisation${error.message &&
            `: ${error.message}`}`
    }

    if (!invitationData) {
        return 'Joining organisation...'
    }
    return <div className="app">You've joined {invitationData.name}!</div>
}

export default OrganisationInvitation
