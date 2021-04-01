import { Divider, LogoIconWhite } from '@dhis2/ui-core'
import DropdownMenu from './DropdownMenu/DropdownMenu'
import DropdownButton from './DropdownButton/DropdownButton'
import DropdownMenuItem from './DropdownMenuItem/DropdownMenuItem'
import DropdownMenuItemLink from './DropdownMenuItemLink/DropdownMenuItemLink'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Icon from 'src/components/Icon/Icon'
import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { getUserProfile } from 'src/selectors/userSelectors'
import styles from './Header.module.css'

const NotLoggedInIcon = () => {
    const { loginWithRedirect } = useAuth0()

    return (
        <button className={styles.signInButton} onClick={loginWithRedirect}>
            Sign in
        </button>
    )
}

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

const ProfileButton = () => {
    const { isLoading, isAuthenticated, logout } = useAuth0()
    const handleLogout = () => {
        logout({ returnTo: window.location.origin })
    }
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

    const menu = (
        <DropdownMenu>
            <DropdownMenuItemLink to="/user">
                Signed in as{' '}
                <span className={styles.profileName}>
                    {profile.given_name || profile.name}
                </span>
            </DropdownMenuItemLink>
            <Divider dense />
            <DropdownMenuItemLink to="/user">Your apps</DropdownMenuItemLink>
            <DropdownMenuItemLink to="/user/apikey">
                Your API keys
            </DropdownMenuItemLink>
            <Divider dense />
            <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
        </DropdownMenu>
    )

    return <DropdownButton icon={icon} menu={menu} />
}

const Header = () => (
    <header className={styles.header}>
        <div className={styles.flexContainer}>
            <Link to="/" className={styles.brand}>
                <LogoIconWhite className={styles.brandLogo} />
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
