import PropTypes from 'prop-types'
import styles from './Icon.module.css'

const Icon = ({ name, title, size = 16, color = 'black' }) => (
    <span
        className={styles.icon}
        title={title}
        style={{ color, fontSize: size }}
    >
        {name}
    </span>
)

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    size: PropTypes.number,
    title: PropTypes.string,
}

export default Icon
