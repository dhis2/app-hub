import PropTypes from 'prop-types'
import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'

const SizeType = PropTypes.oneOf(['small', 'medium', 'large'])
const sizeMap = {
    small: 24,
    medium: 48,
    large: 64,
}

const styles = {
    svgAttributes: {
        viewBox: '0 0 66 66',
    },
    base: {
        padding: '35px',
        display: 'block',
        margin: '0 auto 0 auto',
    },
    large: {
        height: '64px',
        width: '64px',
    },
    small: {
        height: '24px',
        width: '24px',
    },
    medium: {
        height: '48px',
        width: '48px',
    },
    path: {
        fill: 'none',
        strokeWidth: '6',
        strokeLinecap: 'round',
        cx: '33',
        cy: '33',
        r: '30',
    },
    inButton: {
        display: 'inline-block',
        padding: '0',
    },
}

export const Spinner = props => {
    const style = {
        ...styles.base,
        ...(props.inButton && styles.inButton),
        ...props.style,
    }

    const size = props.inButton ? sizeMap['small'] : sizeMap[props.size]

    return <CircularProgress size={size} style={{ ...style }} />
}

Spinner.propTypes = {
    inButton: PropTypes.bool,
    size: SizeType,
    style: PropTypes.object,
}

Spinner.defaultProps = {
    size: 'small',
    inButton: false,
}

export default Spinner
