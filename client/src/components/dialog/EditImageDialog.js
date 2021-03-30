import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import { connect } from 'react-redux'
import DialogBase from './DialogBase'
import { editImage } from '../../actions/actionCreators'
import EditImageForm from '../form/EditImageForm'

export class EditImageDialog extends Component {
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

    handleUpdate(values) {
        const { appId, image } = this.props
        this.props.editImage(appId, image.id, values)
    }

    render() {
        const fieldStyle = {
            display: 'block',
            width: '100%',
        }
        const image = this.props.image
        return (
            <DialogBase
                title="Edit Image"
                approveAction={this.submitForm.bind(this)}
                contentStyle={{ maxWidth: '500px' }}
                bodyStyle={{ overflowY: 'scroll' }}
            >
                <EditImageForm
                    initialValues={{
                        caption: image.caption,
                        description: image.description,
                        logo: image.logo,
                    }}
                    ref={ref => {
                        this.form = ref
                    }}
                    submitted={this.handleUpdate.bind(this)}
                />
            </DialogBase>
        )
    }
}

EditImageDialog.propTypes = {
    app: PropTypes.object,
    appId: PropTypes.string,
    addVersion: PropTypes.func,
}

const mapDispatchToProps = dispatch => ({
    editImage(appId, imageId, data) {
        dispatch(editImage(appId, imageId, data))
    },
})

export default connect(null, mapDispatchToProps)(EditImageDialog)
