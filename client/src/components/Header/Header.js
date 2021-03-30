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
    const { isLoading, isAuthenticated } = useAuth0()
    const profile = useSelector(getUserProfile)

    if (isLoading) {
        return null
    }

    if (!isAuthenticated) {
        return <NotLoggedInIcon />
    }

    return (
        <Link to="/user" title="Account">
            {isAuthenticated && typeof profile?.picture === 'string' ? (
                <Avatar size={24} src={profile.picture} />
            ) : (
                <FontIcon color="white" className="material-icons">
                    account_circle
                </FontIcon>
            )}
        </Link>
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
                    <Link to="/user">My apps</Link>
                </li>
            </ul>
        </div>

        <ProfileButton />
    </header>
)

export default Header
