import React, { useEffect, useState } from 'react'
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

    return <div className="app">You've joined {decoded.organisation}!</div>
}

export default OrganisationInvitation
