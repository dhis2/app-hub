import React, { PropTypes } from "react";
import TransitionGroup from "react-transition-group/TransitionGroup";
import Transition from "react-transition-group/Transition";
import CSSTransition from "react-transition-group/CSSTransition";
import "../../styles/utils/animations.scss";

const duration = 300;

export const FadeAnimation = ({
    component,
    in: inProp,
    children: child,
    ...rest
}) => {
    return (
        <CSSTransition
            classNames="fade"
            in={inProp}
            timeout={duration}
            {...rest}
        >
            {child}
        </CSSTransition>
    );
};

const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0
};

const transitionStyles = {
    entering: { opacity: 1 },
    entered: { opacity: 1 }
};

export const FadeAnimationBasic = ({
    component,
    in: inProp,
    children: child,
    ...rest
}) =>
    <Transition
        appear
        in={inProp}
        timeout={duration}
        unmountOnExit
        mountOnEnter
    >
        {state =>
            React.cloneElement(child, {
                style: { ...defaultStyle, ...transitionStyles[state] }
            })}
    </Transition>;

export const FadeAnimationList = ({ component, children, ...rest }) => {
    return (
        <TransitionGroup
            component={component}
            appear
            enter
            exit={false}
            {...rest}
        >
            {React.Children.map(children, (child, i) => {
                if (child == null) return null;
                return (
                    <FadeAnimationBasic appear={true} key={child.key || child}>
                        {child}
                    </FadeAnimationBasic>
                );
            })}
        </TransitionGroup>
    );
};
