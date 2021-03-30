import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import '@material/toolbar/dist/mdc.toolbar.css'
const propTypes = {
    fixed: PropTypes.bool,
    additionalClasses: PropTypes.string,
    children: PropTypes.node,
}

const baseClassname = 'mdc-toolbar'
const modificatorKeys = ['fixed']

const styles = {
    padding: '0 24px',
}

function getClassNames(props) {
    const modificators = []

    for (let i = 0; i < modificatorKeys.length; ++i) {
        const key = modificatorKeys[i]
        const value = props[key]
        if (value) {
            const mod = `${baseClassname}--${key}`
            modificators.push(mod)
        }
    }
    return classNames(baseClassname, modificators, props.className)
}

const Toolbar = ({ children, style, ...props }) => (
    <div className={getClassNames(props)} style={{ ...styles, ...style }}>
        <div className="mdc-toolbar__row">{children}</div>
    </div>
)

Toolbar.propTypes = propTypes

export default Toolbar
