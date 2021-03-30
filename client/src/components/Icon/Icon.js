import PropTypes from 'prop-types'
import styles from './Icon.module.css'

const Icon = ({ name, color = 'black' }) => (
    <span className={styles.icon} style={{ color }}>
        {name}
    </span>
)

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
}

export default Icon
