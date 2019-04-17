import React, { PropTypes } from 'react'
import classNames from 'classnames'

const AlignType = PropTypes.oneOf(['start', 'end', 'center'])
const modificatorKeys = ['align']
const baseClassname = 'mdc-toolbar__section'

const propTypes = {
    align: AlignType,
    aditionalClasses: PropTypes.string,
    children: PropTypes.node,
}

function getClassNames(props) {
    const modificators = []

    for (let i = 0; i < modificatorKeys.length; ++i) {
        const key = modificatorKeys[i]
        const value = props[key]
        if (value) {
            const mod = `${baseClassname}--${key}-${value}`
            modificators.push(mod)
        }
    }

    return classNames(baseClassname, modificators, props.additionalClasses)
}

const ToolbarSection = ({ children, ...props }) => (
    <div className={getClassNames(props)} style={props.style}>
        {children}
    </div>
)

ToolbarSection.propTypes = propTypes

export default ToolbarSection
