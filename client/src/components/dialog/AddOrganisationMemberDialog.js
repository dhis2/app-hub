import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { addOrganisationMember } from '../../actions/actionCreators'
import * as formUtils from '../form/ReduxFormUtils'
import UploadFileField from '../form/UploadFileField'
import AddOrganisationMemberForm from '../form/AddOrganisationMemberForm'

export class AddOrganisationMemberDialog extends Component {
    constructor(props) {
        super(props)
    }

    submitForm() {
        //submit form manually as dialog actions work as submit button
        const res = this.form.submit()
        console.log(res)
        return res
        if (this.form.valid) {
            return Promise.resolve(res)
        } else {
            return Promise.reject(res)
        }
    }

    handleAddMember = (values) => {
        this.props.addOrganisationMember(this.props.organisation.id, values.email)
    }

    render() {
        const fieldStyle = {
            display: 'block',
            width: '100%',
        }
        return (
            <DialogBase
                title="Add new member"
                approveLabel={'Upload'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
            >
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
    app: PropTypes.object,
    appId: PropTypes.string,
    addVersion: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
    const slug = ownProps.match.params.slug
    const organisation = organisationSelectors.getOrganisationBySlug(state, slug)

    return {
        organisation,
        canEdit: organisation && organisationSelectors.canEditOrganisation(state, organisation.id)
    }
}

const mapDispatchToProps = dispatch => ({
    addOrganisationMember(orgId, email, id) {
        dispatch(addOrganisationMember(orgId, email))
    },
})

export default connect(null, mapDispatchToProps)(AddOrganisationMemberDialog)
