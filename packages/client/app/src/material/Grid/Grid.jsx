import React, { PropTypes } from 'react'
import classNames from 'classnames'
import '@material/layout-grid/dist/mdc.layout-grid.css'

const AlignType = PropTypes.oneOf(['center', 'left'])

const propTypes = {
    children: PropTypes.node,
    additionalClasses: PropTypes.string,
    nested: PropTypes.bool,
    align: AlignType,
}

const styles = {
    inner: {
        maxWidth: 'inherit',
    },
}

function handleStyleProps(props) {
    let style = { ...props.style }
    if (props.nested) {
        style = { ...props.nestedStyle }
    }

    if (props.align) {
        style.maxWidth = style.maxWidth || '1272px'
        switch (props.align) {
            case 'center':
                style.margin = '0 auto'
                break
            case 'left':
                style.marginLeft = '0'
                break
        }
    }

    return style
}

const Grid = ({ ...props }) => {
    const wrap = (
        <div
            className={classNames('mdc-layout-grid', props.additionalClasses)}
            style={handleStyleProps(props)}
        >
            <div className="mdc-layout-grid__inner" style={styles.inner}>
                {props.children}
            </div>
        </div>
    )
    const nestedElem = (
        <div
            className="mdc-layout-grid__inner"
            style={{ ...styles.inner, ...handleStyleProps(props) }}
        >
            {props.children}
        </div>
    )
    return props.nested ? nestedElem : wrap
}

Grid.defaultProps = {
    style: null,
}

Grid.propTypes = propTypes

export default Grid
