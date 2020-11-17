import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Provider, ReactReduxContext, connect } from 'react-redux'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import { closeDialog } from '../../actions/actionCreators'

const styles = {
    contentStyle: {
        maxWidth: '500px',
    },
}

class DialogBase extends Component {
    static buildButton(action, text, primary = false) {
        return <FlatButton label={text} primary={primary} onClick={action} />
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
                .then(
                    () => this.props.autoCloseOnApprove && defaultCloseDialog()
                )
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
            <ReactReduxContext.Consumer>
                {ctx => (
                    <Dialog
                        open
                        title={title}
                        actions={actions}
                        modal={false}
                        autoScrollBodyContent
                        contentStyle={{
                            ...styles.contentStyle,
                            ...contentStyle,
                        }}
                        bodyStyle={{ ...styles.bodyStyle, ...bodyStyle }}
                        onRequestClose={defaultCloseDialog}
                    >
                        <Provider store={ctx.store}>
                            {this.props.children}
                        </Provider>
                    </Dialog>
                )}
            </ReactReduxContext.Consumer>
        )
    }
}

DialogBase.propTypes = {
    approveAction: PropTypes.func,
    approveLabel: PropTypes.string,
    autoCloseOnApprove: PropTypes.bool,
    bodyStyle: PropTypes.object,
    cancelAction: PropTypes.func,
    cancelLabel: PropTypes.string,
    contentStyle: PropTypes.object,
    defaultCloseDialog: PropTypes.func,
    title: PropTypes.string,
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
