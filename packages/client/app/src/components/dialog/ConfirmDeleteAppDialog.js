import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { deleteApp } from '../../actions/actionCreators'

export class ConfirmDeleteAppDialog extends Component {
    constructor(props) {
        super(props)
        this.handleConfirmed = this.handleConfirmed.bind(this)
    }

    handleConfirmed() {
        this.props.deleteApp(this.props.app)
    }

    render() {
        return (
            <DialogBase
                approveAction={this.handleConfirmed}
                approveLabel={'Delete'}
                contentStyle={{ maxWidth: '400px' }}
            >
                Are you sure you want to delete App '{this.props.app.name}'?
                <br /> This cannot be undone.
            </DialogBase>
        )
    }
}

const mapStateToProps = state => ({
    app: state.dialog.dialogProps.app,
})

const mapDispatchToProps = dispatch => ({
    deleteApp(app) {
        dispatch(deleteApp(app))
    },
})

ConfirmDeleteAppDialog.propTypes = {
    app: PropTypes.object.isRequired,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConfirmDeleteAppDialog)
