import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { addOrganisationMember } from '../../actions/actionCreators'
import AddOrganisationMemberForm from '../form/AddOrganisationMemberForm'
import NoteBlock from '../utils/NoteBlock'

export class AddOrganisationMemberDialog extends Component {
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

    handleAddMember = values => {
        this.props.addOrganisationMember(
            this.props.organisation.id,
            values.email
        )
    }

    render() {
        return (
            <DialogBase
                title="Add Member"
                approveLabel={'Add'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{ maxWidth: '600px' }}
                autoCloseOnApprove={false}
            >
                <NoteBlock>
                    The new member must have logged in with the email address at
                    least once before being able to be added to an organisation.
                </NoteBlock>
                <AddOrganisationMemberForm
                    ref={ref => {
                        this.form = ref
                    }}
                    submitted={this.handleAddMember}
                />
            </DialogBase>
        )
    }
}

AddOrganisationMemberDialog.propTypes = {
    organisation: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
    addOrganisationMember(orgId, email, id) {
        dispatch(addOrganisationMember(orgId, email))
    },
})

export default connect(null, mapDispatchToProps)(AddOrganisationMemberDialog)
