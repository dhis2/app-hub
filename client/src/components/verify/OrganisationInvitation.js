import { useAuth0 } from '@auth0/auth0-react'
import JWT from 'jsonwebtoken'
import React from 'react'
import { useQueryParams, StringParam } from 'use-query-params'

const OrganisationInvitation = () => {
    const [queryParams] = useQueryParams({
        invitationToken: StringParam,
    })
    const { loginWithRedirect } = useAuth0()

    const { invitationToken } = queryParams
    const decoded = JWT.decode(invitationToken)
    if (!decoded) {
        return 'An error occurred while decoding token'
    }

    return (
        <div className="app">
            {decoded.from.name} has invited you to join organisation{' '}
            {decoded.organisation}
            <button
                onClick={() =>
                    loginWithRedirect({
                        redirectUri: `${window.location.protocol}//${window.location.host}/verify/org/callback?invitationToken=${invitationToken}`,
                    })
                }
            >
                Join Organisation
            </button>
        </div>
    )
}

export default OrganisationInvitation
