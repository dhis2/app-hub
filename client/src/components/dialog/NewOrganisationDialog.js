import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { addOrganisation } from '../../actions/actionCreators'
import * as formUtils from '../form/ReduxFormUtils'
import UploadFileField from '../form/UploadFileField'
import NewOrganisationForm from '../form/NewOrganisationForm'
import NoteBlock from '../utils/NoteBlock'

export class NewOrganisation extends Component {
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

    handleAddMember = ({ name, email }) => {
        this.props.addOrganisation({ name, email })
    }

    render() {
        const fieldStyle = {
            display: 'block',
            width: '100%',
        }
        return (
            <DialogBase
                title="New Organisation"
                approveLabel={'Add'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{ maxWidth: '600px' }}
                autoCloseOnApprove={false}
            >
                <NewOrganisationForm
                    ref={ref => {
                        this.form = ref
                    }}
                    submitted={this.handleAddMember}
                />
            </DialogBase>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    addOrganisation(organisation) {
        dispatch(addOrganisation(organisation))
    },
})

export default connect(null, mapDispatchToProps)(NewOrganisation)
