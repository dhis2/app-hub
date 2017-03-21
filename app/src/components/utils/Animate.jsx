import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import '../../styles/utils/animations.scss';

export const FadeAnimation = ({props, component, children, ...rest}) => {

    return (
        <ReactCSSTransitionGroup
            component={component}
            transitionName="fade"
            transitionAppear={true}
            transitionLeave={false}
            transitionAppearTimeout={300}
            transitionEnterTimeout={300}
            transitionLeaveTimeout={200}
            >

            {children}
        </ReactCSSTransitionGroup>
    )
}
/*  <FadeAnimation component={Col} key={app.id}
 align="middle" additionalClasses="center"> */

/* </FadeAnimation> */