import PropTypes from 'prop-types'
import { Card } from '@dhis2/ui-core'
import { Children, cloneElement } from 'react'
import styles from './DropdownMenu.module.css'

const DropdownMenu = ({ children }) => (
    <Card className={styles.card}>
        {Children.map(children, (child, index) => {
            if (index === 0) {
                return cloneElement(child, { initialFocus: true })
            }
            return child
        })}
    </Card>
)

DropdownMenu.propTypes = {
    children: PropTypes.node.isRequired,
}

export default DropdownMenu
