import React, { PropTypes, Component } from "react";
import SvgIcon from "material-ui/SvgIcon";

const SizeType = PropTypes.oneOf(["small", "medium", "large"]);

const styles = {
    svgAttributes: {
        viewBox: "0 0 66 66"
    },
    base: {
        padding: "35px",
        display: "block",
        margin: "0 auto 0 auto"
    },
    large: {
        height: "64px",
        width: "64px"
    },
    small: {
        height: "24px",
        width: "24px"
    },
    medium: {
        height: "48px",
        width: "48px"
    },
    path: {
        fill: "none",
        strokeWidth: "6",
        strokeLinecap: "round",
        cx: "33",
        cy: "33",
        r: "30"
    },
    inButton: {
        display: "inline-block",
        padding: "0"
    }
};

export const Spinner = props => {
    const style = {
        ...styles.base,
        ...styles[props.size],
        ...(props.inButton && styles.inButton),
        ...props.style
    };

    return (
        <SvgIcon
            className="spinner"
            {...styles.svgAttributes}
            style={style}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle className="path" {...styles.path} />
        </SvgIcon>
    );
};

Spinner.propTypes = {
    style: PropTypes.object,
    size: SizeType,
    inButton: PropTypes.bool
};

Spinner.defaultProps = {
    size: "small",
    inButton: false
};

export default Spinner;
