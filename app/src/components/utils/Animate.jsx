import React, {PropTypes} from 'react';
import TransitionGroup from 'react-transition-group/TransitionGroup'
import Transition from 'react-transition-group/Transition'
import CSSTransition from 'react-transition-group/CSSTransition';
import '../../styles/utils/animations.scss';

const duration = 30000;

export const FadeAnimation = ({component, children: child, ...rest}) => {

    return (
        <CSSTransition classNames="fade" appear={true} exit={true} timeout={duration} {...rest}>
            {child}
        </CSSTransition>
    )
}

export const FadeAnimationList = ({component, children, ...rest}) => {

    return (
        <TransitionGroup component={component} appear enter exit={false} {...rest}>
            {React.Children.map(children, (child, i) => {
                if(child == null) return null;
            return (
                <FadeAnimation appear={true} key={child}>{child}</FadeAnimation>
            )})}
        </TransitionGroup>
    )
}