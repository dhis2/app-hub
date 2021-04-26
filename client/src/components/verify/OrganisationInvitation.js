import React from 'react'
import { useQueryParams, StringParam } from 'use-query-params'
import JWT from 'jsonwebtoken'
import { useAuth0 } from '@auth0/auth0-react'

const OrganisationInvitation = () => {
    const [queryParams] = useQueryParams({
        token: StringParam,
    })
    const {
        user,
        isLoading,
        isAuthenticated,
        loginWithRedirect,
        getIdTokenClaims,
        ...rest
    } = useAuth0()

    const { token } = queryParams
    console.log(queryParams)
    const decoded = JWT.decode(token)
    if (!decoded) {
        return 'An error occurred while decoding token'
    }
    console.log(JWT.decode(token))
    return (
        <div className="app">
            {decoded.from.name} has invited you to join organisation{' '}
            {decoded.organisation}
            <button
                onClick={() =>
                    loginWithRedirect({
                        redirectUri: `${window.location.protocol}//${window.location.host}/verify/org/callback?token=${token}`,
                    })
                }
            >
                Join Organisation
            </button>
        </div>
    )
}

export default OrganisationInvitation
