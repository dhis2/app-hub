import React, {PropTypes} from 'react';
import classNames from 'classnames'
import '@material/layout-grid/dist/mdc.layout-grid.css';
const propTypes = {
    children: PropTypes.node,
    additionalClasses: PropTypes.string,
    nested: PropTypes.bool,
};

const Grid = ({style, nested, ...props}) => {
    const wrap = (<div className={classNames('mdc-layout-grid', props.additionalClasses)}>
        <div className="mdc-layout-grid__inner">
            {props.children}
        </div>
    </div>);
    const nestedElem = (<div className="mdc-layout-grid__inner">
        {props.children}
    </div>)
    return (
        nested ? nestedElem : wrap
    )
}

Grid.defaultProps = {
    style: null
}

Grid.propTypes = propTypes;

export default Grid;