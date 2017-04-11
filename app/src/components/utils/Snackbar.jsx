import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SnackbarUI from 'material-ui/Snackbar';

export class Snackbar extends Component {

    render() {
        const message = this.props.message;
        return (
            <SnackbarUI open={!!message}
                        message={<span>{this.props.message}</span>}
                        autoHideDuration={5000}
            />
        );
    }
}

Snackbar.propTypes = {
    message: PropTypes.string,
};

const mapStateToProps = (state) => ({
    message: state.snackbar.message,
});

export default connect(
    mapStateToProps
)(Snackbar);
