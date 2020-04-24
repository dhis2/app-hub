import React, { Component } from "react";
import { Link } from "react-router-dom";
import IconButton from "material-ui/IconButton";
import FontIcon from "material-ui/FontIcon";

const APPHUB_URL = "https://apps.dhis2.org";
const MORE_INFO_URL = "https://developers.dhis2.org/2020/04/appstore-deprecation/"

const styles = {
    root: {
        backgroundColor: "#f1e05a",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto",
    },
};
export const DeprecatedBanner = (props) => {
    return (
        <div style={styles.root}>
            <p style={styles.text}>
                The App Store has been deprecated. It has been renamed to App
                Hub. Go to the new
                <a href={APPHUB_URL}>
                    <b> DHIS2 App Hub</b>
                </a>
                .
                <br />
                Click{" "}
                <a href={MORE_INFO_URL} target="_blank">
                    <b>here </b>
                </a>
                for more information.
            </p>
            <IconButton style={styles.resetButton} onClick={props.onClose}>
                <FontIcon className="material-icons">clear</FontIcon>
            </IconButton>
        </div>
    );
};

class DeprecatedBannerContainer extends Component {
    constructor() {
        super();
        this.state = {
            show: true,
        };
    }

    handleClose = () => {
        this.setState({
            show: false,
        });
    };

    render() {
        return this.state.show ? (
            <DeprecatedBanner onClose={this.handleClose} />
        ) : null;
    }
}

export default DeprecatedBannerContainer;
