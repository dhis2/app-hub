import React, { PropTypes } from 'react';
import classNames from 'classnames';

const propTypes = {
    fixed: PropTypes.bool,
    additionalClasses: PropTypes.string,
    children: PropTypes.node,
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
    return classNames(baseClassname, modificators, props.className);
}

const Toolbar = ({children, style, ...props}) => (
    <div className={getClassNames(props)} style={style}>
        {children}
    </div>
)

Toolbar.propTypes = propTypes;

export default Toolbar;
