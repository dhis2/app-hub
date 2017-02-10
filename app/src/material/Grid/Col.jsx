import React, { PropTypes } from 'react';
import classNames from 'classnames';
import 'material-components-web/dist/material-components-web.css';

const ScreenType = PropTypes.oneOf(['tablet', 'phone', 'desktop']);
const AlignType = PropTypes.oneOf(['top', 'middle', 'bottom']);
const modificatorKeys = ['order', 'align', 'span', 'spanScreen'];
const className = 'mdc-layout-grid__cell';

const propTypes = {
    span: PropTypes.number,
    spanScreen: PropTypes.shape({
        screen: ScreenType,
        value: PropTypes.number,
    }),
    order: PropTypes.number,
    align: AlignType,
    children: PropTypes.node,
};

function getClassNames(props) {
    const modificators = [];

    for (let i = 0; i < modificatorKeys.length; ++i) {
        const key = modificatorKeys[i];
        const value = props[key];
        if (value) {
            let mod = `${className}--${key}-${value}`;
            if(key === 'spanScreen') {
                mod = `${className}--span-${value}-${value.screen}`
            }
            modificators.push(mod);
        }
    }

    return classNames(className, modificators);
}

const Col = (props) => (
    <div className={getClassNames(props)}>
        {props.children}
    </div>
)

Col.propTypes = propTypes;

export default Col;