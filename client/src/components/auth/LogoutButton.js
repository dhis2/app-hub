import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'

const LogoutButton = ({ children }) => {
    const { logout, isAuthenticated } = useAuth0()

    return (
        <button
            onClick={() =>
                logout({ returnTo: window.location.origin, localOnly: true })
            }
        >
            {isAuthenticated ? 'Log out' : 'Log in'}
        </button>
    )
}

export default LogoutButton
