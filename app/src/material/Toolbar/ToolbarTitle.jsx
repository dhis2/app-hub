import React, { PropTypes } from 'react';
import classNames from 'classnames';

const AlignType = PropTypes.oneOf(['start', 'end']);
const modificatorKeys = ['align'];
const baseClassname = 'mdc-toolbar__section';

const propTypes = {
    align: AlignType,
    children: PropTypes.node,
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

    return classNames(baseClassname, modificators);
}
const ToolbarTitle = ({children, ...props}) => (
        <section className={getClassNames(props)}>
            <span className="mdc-toolbar__title">
                {props.text ? props.text : children}
                </span>
        </section>
)

ToolbarTitle.propTypes = propTypes;
ToolbarTitle.defaultProps = defaultProps;
export default ToolbarTitle;