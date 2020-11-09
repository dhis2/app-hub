import PropTypes from 'prop-types'

import React, { Component } from 'react'

import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { editAppVersion, loadChannels } from '../../actions/actionCreators'

import AppVersionForm from '../form/AppVersionForm'

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

    handleEdit({ data }) {
        this.props.editVersion(this.props.appId, data)
    }

    render() {
        return (
            <DialogBase
                title="Edit version"
                approveLabel={'Save'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{ minHeight: '550px' }}
            >
                <AppVersionForm
                    isNew={false}
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
    closeDialog: PropTypes.func,
    editVersion: PropTypes.func,
    loadChannels: PropTypes.func,
}

const mapDispatchToProps = dispatch => ({
    editVersion(appId, appVersion) {
        dispatch(editAppVersion(appId, appVersion))
    },
    loadChannels() {
        dispatch(loadChannels())
    },
})

export default connect(undefined, mapDispatchToProps)(EditAppVersionDialog)
