import React from 'react'
import { useSelector } from 'react-redux'
import Toolbar from '../../material/Toolbar/Toolbar'
import ToolbarSection from '../../material/Toolbar/ToolbarSection'
import ToolbarTitle from '../../material/Toolbar/ToolbarTitle'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import { Link } from 'react-router-dom'
import Theme from '../../styles/theme'
import Avatar from 'material-ui/Avatar'
import logo from '../../assets/img/dhis2_logo_reversed.svg'
import { useAuth0 } from '@auth0/auth0-react'
import { getUserProfile } from '../../selectors/userSelectors'

const styles = {
    logo: {
        height: 32,
    },
}

const NotLoggedInIcon = () => (
    <FontIcon color="white" className="material-icons">
        account_circle
    </FontIcon>
)

const ProfileButton = () => {
    const {
        user,
        isLoading,
        isAuthenticated,
        loginWithRedirect,
        getIdTokenClaims,
        ...rest
    } = useAuth0()

    const profile = useSelector(getUserProfile)

    const button = (
        <IconButton
            style={{ transform: 'translate(12px)' }}
            onClick={!isAuthenticated ? loginWithRedirect : undefined}
            title="Account"
        >
            {(isAuthenticated || isLoading) &&
            typeof profile?.picture === 'string' ? (
                <Avatar size={24} src={profile.picture} />
            ) : (
                <NotLoggedInIcon />
            )}
        </IconButton>
    )
    return isAuthenticated ? <Link to="/user">{button}</Link> : button
}

const Header = props => (
    <Toolbar
        style={{
            backgroundColor: Theme.palette.primary1Color,
            padding: '0 24px',
        }}
    >
        <ToolbarSection
            align="center"
            style={{
                maxWidth: Theme.container.maxWidth - 48,
                margin: '0 auto',
            }}
        >
            <Link to="/" style={styles.logo}>
                <img src={logo} style={styles.logo} />
            </Link>
            <ToolbarTitle align="center" titleStyle={{ margin: 0 }}>
                <Link to="/">App Hub</Link>
            </ToolbarTitle>

            <ProfileButton />
        </ToolbarSection>
    </Toolbar>
)

export default Header
