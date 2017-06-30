import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import '../../styles/utils/animations.scss';

export const FadeAnimation = ({component, children, ...rest}) => {

    return (
        <ReactCSSTransitionGroup
            component={component}
            transitionName="fade"
            transitionAppear={true}
            transitionLeave={false}
            transitionAppearTimeout={300}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={200}
            {...rest}
            >

            {children}
        </ReactCSSTransitionGroup>
    )
}