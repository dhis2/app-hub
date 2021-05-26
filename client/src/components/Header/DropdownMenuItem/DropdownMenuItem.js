import PropTypes from 'prop-types'
import { useRef, useEffect } from 'react'
import styles from './DropdownMenuItem.module.css'

const DropdownMenuItem = ({ onClick, children, initialFocus }) => {
    const ref = useRef()

    useEffect(() => {
        if (initialFocus) {
            ref.current.focus()
        }
    }, [initialFocus])

    return (
        <button className={styles.item} onClick={onClick} ref={ref}>
            {children}
        </button>
    )
}

DropdownMenuItem.propTypes = {
    children: PropTypes.node.isRequired,
    initialFocus: PropTypes.bool,
    onClick: PropTypes.func,
}

export default DropdownMenuItem
