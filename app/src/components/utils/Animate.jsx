import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import '../../styles/utils/animations.scss';

export const FadeAnimation = ({component, children, ...rest}) => {
    const CompWithProps = (props) => React.createElement(component, {...props,...rest});

    return (
        <ReactCSSTransitionGroup
            component={component ? CompWithProps : undefined}
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