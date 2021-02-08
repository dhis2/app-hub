import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SnackbarUI from 'material-ui/Snackbar'
import { connect } from 'react-redux'
import { emptySnackbar } from '../../actions/actionCreators'

const styles = {
    root: {
        minHeight: '48px',
    },
    body: {
        lineHeight: 'initial',
        height: 'auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
    },
}
export class Snackbar extends Component {
    render() {
        const { message, retryAction } = this.props.snackbar
        const retryProps = {
            action: 'Retry',
            onClick: retryAction,
        }

        return (
            <SnackbarUI
                open={!!message}
                style={styles.root}
                bodyStyle={styles.body}
                message={message}
                autoHideDuration={4000}
                onRequestClose={() => this.props.emptySnackbar()}
                {...(retryAction ? { ...retryProps } : null)}
            />
        )
    }
}

Snackbar.propTypes = {
    snakbar: PropTypes.shape({
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        retryAction: PropTypes.object,
    }),
}

const mapStateToProps = state => ({
    snackbar: state.snackbar,
})

const mapDispatchToProps = dispatch => ({
    emptySnackbar() {
        dispatch(emptySnackbar())
    },

    retryAction(action) {
        dispatch(action)
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar)
