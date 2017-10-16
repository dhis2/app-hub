import PropTypes from 'prop-types';
import React, { Component } from "react";
import "../../styles/utils/loaders.scss";

const SizeType = PropTypes.oneOf(["small", "medium", "large"]);
export class Spinner extends Component {
    constructor(props) {
        super(props);

        this.renderSmall = this.renderSmall.bind(this);
        this.renderMedium = this.renderMedium.bind(this);
        this.renderLarge = this.renderLarge.bind(this);
    }

    renderSmall() {
        return (
            <div className="loading-small" style={this.props.style}>
                <div className="spinner">
                    <div className="mask">
                        <div className="maskedCircle" />
                    </div>
                </div>
            </div>
        );
    }

    renderMedium() {
        return (
            <div className="loading-medium" style={this.props.style}>
                <div className="spinner">
                    <div className="mask">
                        <div className="maskedCircle" />
                    </div>
                </div>
            </div>
        );
    }

    renderLarge() {
        return (
            <div className="loading-large" style={this.props.style}>
                <div className="spinner">
                    <div className="mask">
                        <div className="maskedCircle" />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        switch (this.props.size) {
            case "small": {
                return this.renderSmall();
            }
            case "medium": {
                return this.renderMedium();
            }
            case "large": {
                return this.renderLarge();
            }
            default: {
                return this.renderSmall();
            }
        }
    }
}

Spinner.propTypes = {
    size: SizeType,
    style: PropTypes.object
};
