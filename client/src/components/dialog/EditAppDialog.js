// eslint-disable-next-line react/no-deprecated
import PropTypes from 'prop-types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { editApp } from '../../actions/actionCreators'
import EditAppForm from '../form/EditAppForm'

export class EditAppDialog extends Component {
    constructor(props) {
        super(props)
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
        this.props.editApp(this.props.app, values.data)
    }

    render() {
        const app = this.props.app
        return (
            <DialogBase
                title="Edit App"
                approveAction={this.submitForm.bind(this)}
            >
                <EditAppForm
                    initialValues={{
                        appName: app.name,
                        description: app.description,
                        appType: app.appType,
                        sourceUrl: app.sourceUrl,
                        contactEmail: app.developer.email,
                        developerAddress: app.developer.address,
                        developerOrg: app.developer.organisation,
                    }}
                    ref={ref => {
                        this.form = ref
                    }}
                    submitted={this.handleCreate.bind(this)}
                />
            </DialogBase>
        )
    }
}

EditAppDialog.propTypes = {
    app: PropTypes.object,
    editApp: PropTypes.func.required,
}

const mapDispatchToProps = dispatch => ({
    editApp(app, data) {
        dispatch(editApp(app, data))
    },
})

export default connect(null, mapDispatchToProps)(EditAppDialog)
