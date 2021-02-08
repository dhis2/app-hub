import PropTypes from 'prop-types'

import React, { Component } from 'react'

import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { addAppVersion } from '../../actions/actionCreators'

import { loadChannels } from '../../actions/actionCreators'

import AppVersionForm from '../form/AppVersionForm'
export class NewAppVersionDialog extends Component {
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

    handleCreate(values) {
        this.props.addVersion(values.data, values.file, this.props.app.id)
    }

    render() {
        return (
            <DialogBase
                title="New App Version"
                approveLabel={'Upload'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{ minHeight: '650px' }}
            >
                <AppVersionForm
                    isNew={true}
                    ref={ref => {
                        this.form = ref
                    }}
                    submitted={this.handleCreate.bind(this)}
                />
            </DialogBase>
        )
    }
}

NewAppVersionDialog.propTypes = {
    addVersion: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    closeDialog: PropTypes.func.isRequired,
    loadChannels: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
    addVersion(appVersion, file, id) {
        dispatch(addAppVersion(appVersion, file, id))
    },
    loadChannels() {
        dispatch(loadChannels())
    },
})

export default connect(undefined, mapDispatchToProps)(NewAppVersionDialog)
