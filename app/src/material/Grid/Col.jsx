import React, { PropTypes } from 'react';
import classNames from 'classnames';

const AlignType = PropTypes.oneOf(['top', 'middle', 'bottom']);
const screenTypes = [ 'phone', 'tablet', 'desktop']
const modificatorKeys = ['order', 'align', 'span', ...screenTypes];
const baseClassname = 'mdc-layout-grid__cell';

const propTypes = {
    span: PropTypes.number,
    tablet: PropTypes.number,
    phone: PropTypes.number,
    desktop: PropTypes.number,
    order: PropTypes.number,
    align: AlignType,
    additionalClasses: PropTypes.string,
    children: PropTypes.node,
};

function getClassNames(props) {
    let modificators = [];

    for (let i = 0; i < modificatorKeys.length; ++i) {
        const key = modificatorKeys[i];
        const value = props[key];
        if (value) {
            let mod = `${baseClassname}--${key}-${value}`;
            if (screenTypes.includes(key)) {
                mod = `${baseClassname}--span-${value}-${key}`
            }
            modificators.push(mod);
        }
    }

    return classNames(baseClassname, modificators, props.additionalClasses);
}

const Col = ({children, style, ...props}) => (
    <div className={getClassNames(props)} style={style} >
        {children}
    </div>
)

Col.propTypes = propTypes;

export default Col;