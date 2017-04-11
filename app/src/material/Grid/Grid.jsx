import React, { PropTypes } from 'react';
import classNames from 'classnames'
const propTypes = {
    children: PropTypes.node,
    additionalClasses: PropTypes.string
};

const Grid = ({style, ...props}) => (
    <div className={classNames('mdc-layout-grid', props.additionalClasses)} style={style}>
        {props.children}
    </div>
)

Grid.defaultProps = {
    style: null
}

Grid.propTypes = propTypes;

export default Grid;