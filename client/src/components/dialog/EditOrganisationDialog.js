import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { editOrganisation } from '../../actions/actionCreators'
import OrganisationForm from '../form/OrganisationForm'
import DialogBase from './DialogBase'

export class EditOrganisationDialog extends Component {
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

    handleEditOrganisation = values => {
        this.props.editOrganisation(this.props.organisation.id, values)
    }

    render() {
        return (
            <DialogBase
                title="Edit Organisation"
                approveLabel={'Ok'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{ maxWidth: '600px' }}
                autoCloseOnApprove={false}
            >
                <OrganisationForm
                    ref={ref => {
                        this.form = ref
                    }}
                    initialValues={{
                        name: this.props.organisation.name,
                        email: this.props.organisation.email,
                    }}
                    submitted={this.handleEditOrganisation}
                />
            </DialogBase>
        )
    }
}

EditOrganisationDialog.PropTypes = {
    organisation: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
        owner: PropTypes.objectOf(
            PropTypes.shape({
                email: PropTypes.string,
                id: PropTypes.string,
                name: PropTypes.string,
            })
        ),
        slug: PropTypes.string,
        users: PropTypes.array,
    }),
}

const mapDispatchToProps = dispatch => ({
    editOrganisation(id, editObject) {
        dispatch(editOrganisation(id, editObject))
    },
})

export default connect(null, mapDispatchToProps)(EditOrganisationDialog)
