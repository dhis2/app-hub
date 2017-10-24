import React, { PropTypes, Component } from "react";
import { connect, dispatch } from "react-redux";
import SnackbarUI from "material-ui/Snackbar";
import { emptySnackbar } from "../../actions/actionCreators";
export class Snackbar extends Component {
    render() {
        const { message, retryAction } = this.props.snackbar;
        const retryProps = {
            action: "Retry",
            onActionTouchTap: retryAction
        };

        return (
            <SnackbarUI
                open={!!message}
                message={message}
                autoHideDuration={4000}
                onRequestClose={() => this.props.emptySnackbar()}
                {...(retryAction ? { ...retryProps } : null)}
            />
        );
    }
}

Snackbar.propTypes = {
    snakbar: PropTypes.shape({
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        retryAction: PropTypes.object
    })
};

const mapStateToProps = state => ({
    snackbar: state.snackbar
});

const mapDispatchToProps = dispatch => ({
    emptySnackbar() {
        dispatch(emptySnackbar());
    },

    retryAction(action) {
        dispatch(action);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
