import {
    DropdownButton,
    FlyoutMenu,
    MenuItem,
    MenuSectionHeader,
} from '@dhis2/ui-core'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Icon from 'src/components/Icon/Icon'
import { Link } from 'react-router-dom'
import logo from 'src/assets/img/dhis2-icon-reversed.svg'
import { useAuth0 } from '@auth0/auth0-react'
import { getUserProfile } from 'src/selectors/userSelectors'
import styles from './Header.module.css'

const Avatar = ({ size, src }) => (
    <img
        alt="Avatar"
        src={src}
        style={{ height: size, width: size, borderRadius: '50%' }}
    />
)

Avatar.propTypes = {
    size: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
}

const NotLoggedInIcon = () => {
    const { loginWithRedirect } = useAuth0()

    return (
        <button className={styles.signInButton} onClick={loginWithRedirect}>
            Sign in
        </button>
    )
}

const ProfileButton = () => {
    const history = useHistory()
    const { isLoading, isAuthenticated, logout } = useAuth0()
    const profile = useSelector(getUserProfile)

    if (isLoading) {
        return null
    }

    if (!isAuthenticated) {
        return <NotLoggedInIcon />
    }

    const icon =
        typeof profile?.picture === 'string' ? (
            <Avatar size={24} src={profile.picture} />
        ) : (
            <Icon size={24} name="account_circle" color="white" />
        )

    return (
        <DropdownButton
            className={styles.profileMenu}
            small
            secondary
            icon={icon}
            component={
                <FlyoutMenu dense>
                    <MenuSectionHeader
                        label={`Signed in as ${profile.given_name ||
                            profile.name}`}
                    />
                    <MenuItem
                        label="Your apps"
                        href="/user"
                        onClick={() => history.push('/user')}
                    />
                    <MenuItem
                        label="Sign out"
                        onClick={() =>
                            logout({ returnTo: window.location.origin })
                        }
                    />
                </FlyoutMenu>
            }
        ></DropdownButton>
    )
}

const Header = () => (
    <header className={styles.header}>
        <div className={styles.flexContainer}>
            <Link to="/" className={styles.brand}>
                <img src={logo} className={styles.brandLogo} />
                <h1 className={styles.brandText}>DHIS2 App Hub</h1>
            </Link>

            <ul className={styles.navLinks}>
                <li className={styles.navLink}>
                    <Link to="/">All apps</Link>
                </li>
                <li className={styles.navLink}>
                    <Link to="/user">Your apps</Link>
                </li>
            </ul>
        </div>

        <ProfileButton />
    </header>
)

export default Header
