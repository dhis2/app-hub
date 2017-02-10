import React, { PropTypes } from 'react';
import 'material-components-web/dist/material-components-web.css';

const propTypes = {
    children: PropTypes.node
};

const Grid = (props) => (
    <div className="mdc-layout-grid">
        {props.children}
    </div>
)

Grid.propTypes = propTypes;

export default Grid;