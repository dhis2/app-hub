// eslint-disable-next-line react/no-deprecated
import React, { PropTypes, Component } from 'react'

import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { editAppVersion, loadChannels } from '../../actions/actionCreators'

import EditAppVersionForm from '../form/EditAppVersionForm'

export class EditAppVersionDialog extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.loadChannels()
    }

    submitForm() {
        //submit form manually as dialog actions work as submit button
        const res = this.form.submit()
        if (this.form.valid) {
            return Promise.resolve(res)
        } else {
            return Promise.reject(res)
        }
    }

    handleEdit(editedVersion) {
        this.props.editVersion(this.props.appId, editedVersion)
    }

    render() {
        if (this.props.channels.loading) return null

        return (
            <DialogBase
                title="Edit version"
                approveLabel={'Save'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
            >
                <EditAppVersionForm
                    ref={ref => {
                        this.form = ref
                    }}
                    initialValues={{
                        ...this.props.appVersion,
                    }}
                    submitted={this.handleEdit.bind(this)}
                />
            </DialogBase>
        )
    }
}

EditAppVersionDialog.propTypes = {
    appId: PropTypes.string,
    appVersion: PropTypes.object,
    channels: PropTypes.object,
    closeDialog: PropTypes.func,
    editVersion: PropTypes.func,
    loadChannels: PropTypes.func,
}

const mapStateToProps = state => ({
    channels: state.channels,
})

const mapDispatchToProps = dispatch => ({
    editVersion(appId, appVersion) {
        dispatch(editAppVersion(appId, appVersion))
    },
    loadChannels() {
        dispatch(loadChannels())
    },
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditAppVersionDialog)
