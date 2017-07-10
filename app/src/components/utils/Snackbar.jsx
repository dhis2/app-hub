import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SnackbarUI from 'material-ui/Snackbar';
import { emptySnackbar } from '../../actions/actionCreators';
export class Snackbar extends Component {

    render() {
        const message = this.props.message;
        return (
            <SnackbarUI open={!!message}
                        message={this.props.message}
                        autoHideDuration={4000}
                        onRequestClose={() => this.props.emptySnackbar()}
            />
        );
    }
}

Snackbar.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

const mapStateToProps = (state) => ({
    message: state.snackbar.message,
});

const mapDispatchToProps = (dispatch) => ({
    emptySnackbar() {
        dispatch(emptySnackbar())
    }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Snackbar);
