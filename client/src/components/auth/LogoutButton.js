import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { ListItem } from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'

export const ListItemLogoutButton = props => {
    const { logout } = useAuth0()
    return (
        <ListItem
            primaryText="Logout"
            leftIcon={
                <FontIcon className="material-icons">exit_to_app</FontIcon>
            }
            onClick={() => logout({ returnTo: window.location.origin })}
            {...props}
        />
    )
}
