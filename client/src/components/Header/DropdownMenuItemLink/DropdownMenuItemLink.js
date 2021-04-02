import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useRef, useEffect } from 'react'
import styles from '../DropdownMenuItem/DropdownMenuItem.module.css'

const isModifiedEvent = event =>
    event.metaKey || event.altKey || event.ctrlKey || event.shiftKey

const DropdownMenuItemLink = ({ to, children, initialFocus }) => {
    const history = useHistory()
    const handleClick = event => {
        if (!isModifiedEvent(event)) {
            event.preventDefault()
            history.push(to)
        }
    }
    const ref = useRef()

    useEffect(() => {
        if (initialFocus) {
            ref.current.focus()
        }
    }, [initialFocus])

    return (
        <a className={styles.item} href={to} onClick={handleClick} ref={ref}>
            {children}
        </a>
    )
}

DropdownMenuItemLink.propTypes = {
    children: PropTypes.node.isRequired,
    to: PropTypes.string.isRequired,
    initialFocus: PropTypes.bool,
}

export default DropdownMenuItemLink
