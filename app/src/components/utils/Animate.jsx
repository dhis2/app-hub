import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import '../../styles/utils/animations.scss';

export const FadeAnimation = ({component, children, style}) => {

    return (
        <ReactCSSTransitionGroup
            component={component}
            transitionName="fade"
            transitionAppear={true}
            transitionLeave={false}
            transitionAppearTimeout={300}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={200}
            //cannot pass props to component, as it will be destroyed
            //when unmounted. Style here instead.
            style={style}
            >

            {children}
        </ReactCSSTransitionGroup>
    )
}