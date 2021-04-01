import PropTypes from 'prop-types'
import styles from './Icon.module.css'

const Icon = ({ name, size = 16, color = 'black' }) => (
    <span className={styles.icon} style={{ color, fontSize: size }}>
        {name}
    </span>
)

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.number,
}

export default Icon
