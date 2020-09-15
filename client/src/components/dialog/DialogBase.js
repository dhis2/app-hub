import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import { closeDialog } from '../../actions/actionCreators'

const styles = {
    bodyStyle: {},
    contentStyle: {
        maxWidth: '500px',
    },
}

class DialogBase extends Component {
    static buildButton(action, text, primary = false) {
        return <FlatButton label={text} primary={primary} onTouchTap={action} />
    }

    render() {
        const {
            title,
            cancelAction,
            cancelLabel,
            approveAction,
            approveLabel,
            contentStyle,
            bodyStyle,
            defaultCloseDialog,
        } = this.props

        const actions = []

        const finalAction = () => {
            Promise.resolve(approveAction())
                .then(() => this.props.autoCloseOnApprove && defaultCloseDialog())
                .catch(() => {})
        }

        actions.push(
            DialogBase.buildButton(
                cancelAction || defaultCloseDialog,
                cancelLabel || 'Cancel'
            )
        )
        if (approveAction)
            actions.push(
                DialogBase.buildButton(
                    finalAction,
                    approveLabel || 'Done',
                    true
                )
            )

        return (
            <Dialog
                open
                title={title}
                actions={actions}
                modal={false}
                autoScrollBodyContent
                contentStyle={
                    { ...styles.contentStyle, ...contentStyle } ||
                    styles.contentStyle
                }
                bodyStyle={
                    { ...styles.bodyStyle, ...bodyStyle } || styles.bodyStyle
                }
                onRequestClose={defaultCloseDialog}
            >
                {this.props.children}
            </Dialog>
        )
    }
}

DialogBase.propTypes = {
    title: PropTypes.string,
    cancelLabel: PropTypes.string,
    approveLabel: PropTypes.string,
    cancelAction: PropTypes.func,
    approveAction: PropTypes.func,
    defaultCloseDialog: PropTypes.func,
    contentStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    autoCloseOnApprove: PropTypes.bool,
}

DialogBase.defaultProps = {
    autoCloseOnApprove: true,
}

const mapDispatchToProps = dispatch => ({
    defaultCloseDialog() {
        dispatch(closeDialog())
    },
})

export default connect(null, mapDispatchToProps)(DialogBase)
