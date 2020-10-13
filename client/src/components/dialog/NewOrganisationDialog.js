import React, { Component } from 'react'
import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { addOrganisation } from '../../actions/actionCreators'
import OrganisationForm from '../form/OrganisationForm'

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
        return (
            <DialogBase
                title="New Organisation"
                approveLabel={'Add'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{ maxWidth: '600px' }}
                autoCloseOnApprove={false}
            >
                <OrganisationForm
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
