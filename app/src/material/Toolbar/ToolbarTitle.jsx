import React, { PropTypes } from 'react';
import classNames from 'classnames';

const AlignType = PropTypes.oneOf(['start', 'end', 'center']);
const modificatorKeys = ['align'];
const baseClassname = 'mdc-toolbar__section';

const propTypes = {
    align: AlignType,
    additionalClasses: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object,
    titleStyle: PropTypes.object,
};

const defaultProps = {
    align: "start",
}


function getClassNames(props) {
    const modificators = [];

    for (let i = 0; i < modificatorKeys.length; ++i) {
        const key = modificatorKeys[i];
        const value = props[key];
        if (value) {
            const mod = `${baseClassname}--${key}-${value}`;
            modificators.push(mod);
        }
    }

    return classNames(baseClassname, modificators, props.additionalClasses);
}
const ToolbarTitle = ({children, ...props}) => (
        <section className={getClassNames(props)} style={props.style}>
            <span className="mdc-toolbar__title" style={props.titleStyle}>
                {props.text ? props.text : children}
                </span>
        </section>
)

ToolbarTitle.propTypes = propTypes;
ToolbarTitle.defaultProps = defaultProps;
export default ToolbarTitle;