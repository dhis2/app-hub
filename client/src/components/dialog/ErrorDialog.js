import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import DialogRoot from './DialogBase'

export class ErrorDialog extends Component {
    render() {
        return
        ;<DialogRoot
            cancelAction={this.props.closeDialog}
            contentStyle={{ maxWidth: '400px' }}
        >
            {this.props.message}
        </DialogRoot>
    }
}

ErrorDialog.propTypes = {
    message: PropTypes.string,
    closeDialog: PropTypes.func,
}

const mapStateToProps = state => ({
    message: state.dialog.props.message,
})

export default connect(mapStateToProps)(ErrorDialog)
