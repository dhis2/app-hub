import PropTypes from 'prop-types';
import React from "react";
import TransitionGroup from "react-transition-group/TransitionGroup";
import Transition from "react-transition-group/Transition";
import CSSTransition from "react-transition-group/CSSTransition";
import "../../styles/utils/animations.scss";

const duration = 300;

export const FadeAnimation = ({ children: child, ...rest }) => {
    return (
        <CSSTransition {...rest} classNames="fade" timeout={duration}>
            {child}
        </CSSTransition>
    );
};

const defaultStyle = {
    transition: `opacity ${duration}ms linear`,
    opacity: 0
};

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 }
};

const getStylesForTransitionState = state => {
    return {
        ...defaultStyle,
        ...transitionStyles[state]
    };
};

const onEnter = (html, isAppearing) => {
    console.log("ENTER " + isAppearing);
};

const onEntering = (html, isAppearing) => {
    console.log("ENTERING DONE " + isAppearing);
};

const onEntered = (html, isAppearing) => {
    console.log("ENTERED " + isAppearing);
};

export const FadeAnimationBasic = ({
    component,
    children: child,
    ...props
}) => (
    <Transition timeout={duration} {...props}>
        {state =>
            React.cloneElement(child, {
                style: {
                    ...child.props.style,
                    ...getStylesForTransitionState(state)
                }
            })}
    </Transition>
);

export const FadeAnimationList = ({ component, children, ...rest }) => {
    return (
        <TransitionGroup component={component} {...rest}>
            {React.Children.map(children, (child, i) => {
                return (
                    <FadeAnimation key={child.key || child}>
                        {child}
                    </FadeAnimation>
                );
            })}
        </TransitionGroup>
    );
};
