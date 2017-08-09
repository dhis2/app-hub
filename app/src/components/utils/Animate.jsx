import React, { PropTypes } from "react";
import TransitionGroup from "react-transition-group/TransitionGroup";
import Transition from "react-transition-group/Transition";
import CSSTransition from "react-transition-group/CSSTransition";
import "../../styles/utils/animations.scss";

const duration = 300;

export const FadeAnimation = ({
    children: child,
    ...rest
}) => {
    return (
        <CSSTransition
            {...rest}
            classNames="fade"
            timeout={duration}
        >
            {child}
        </CSSTransition>
    );
};

const defaultStyle = {
    transition: `opacity ${duration}ms linear`,
    opacity: 0,
    border: '2px solid red',
};

const transitionStyles = {
    entering: { opacity: 0, border: '2px solid yellow', transition: `opacity ${duration}ms linear`,},
    entered: { opacity: 1, border: '2px solid blue', },
    exited: {opacity: 1}
};

const getStylesForTransitionState = (state) => {
    console.log('State', state);
    return {
        ...defaultStyle,
        ...transitionStyles[state]
    }
}


const onEnter = (html, isAppearing) => {
    console.log("ENTER " + isAppearing);
};

const onEntering = (html, isAppearing) => {
    console.log("ENTERING DONE " + isAppearing);
};

const onEntered = (html, isAppearing) => {
    console.log("ENTERED " + isAppearing);
};

export const FadeAnimationBasic = ({ component, children: child, ...props }) =>
    <Transition
        timeout={duration}
        onEnter={onEnter}
        onEntering={onEntering}
        onEntered={onEntered}
        {...props}
        appear={true}
    >
        {state =>
            React.cloneElement(child, {
                style: {...child.props.style, ...getStylesForTransitionState(state)}
            })}
    </Transition>;

export const FadeAnimationList = ({ component, children, ...rest }) => {
    return (
        <TransitionGroup component={component} {...rest}>
            {React.Children.map(children, (child, i) => {
                console.log(child)
                return (
                    <FadeAnimation exit={false} key={child.key || child}>
                        {child}
                    </FadeAnimation>
                );
            })}
        </TransitionGroup>
    );
};
