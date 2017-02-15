import React, { PropTypes } from 'react';
import classNames from 'classnames';


const propTypes = {
    children: PropTypes.node,
    fixed: PropTypes.bool
};

const baseClassname = 'mdc-toolbar';
const modificatorKeys = ['fixed'];

function getClassNames(props) {
    const modificators = [];

    for (let i = 0; i < modificatorKeys.length; ++i) {
        const key = modificatorKeys[i];
        const value = props[key];
        if (value) {
            const mod = `${baseClassname}--${key}`;
            modificators.push(mod);
        }
    }

    return classNames(baseClassname, modificators);
}

const Toolbar = ({children, ...props}) => (
    <div className={getClassNames(props)}>
        {children}
    </div>
)

Toolbar.propTypes = propTypes;

export default Toolbar;
