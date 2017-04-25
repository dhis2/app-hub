import React, {PropTypes, Component} from 'react'
import {Field, Form, reduxForm} from 'redux-form';
import * as formUtils from './ReduxFormUtils';
import UploadFileField from './UploadFileField';

class MultipleUploadFileFields extends Component {
    constructor(props) {
        super(props);

        this.handleAddField = this.handleAddField.bind(this);
        this.onSubmitSuccess = this.onSubmitSuccess.bind(this);
        this.initstate = {
            fields: [0],
            count: 1,
        };
        this.state = {
            ...this.initstate,
        }

    }

    handleRemoveField(index) {
        this.setState({
            ...this.state,
            fields: this.state.fields.filter((id) => id !== index)
        });
    }

    handleAddField(e) {

        this.setState({
                ...this.state,
                count: this.state.count + 1,
                fields: [...this.state.fields, this.state.count + 1]
            }
        )
    }

    onSubmit(values) {
        //transform object of fields to array
        const arr = Object.keys(values).map((key, ind) => {
            return values[key];
        })

        return this.props.submitted(arr);
    }

    onSubmitSuccess() {
        this.props.reset();
        this.setState({
            ...this.initstate,
        })
    }

    render() {
        const {handleSubmit, pristine, submitting} = this.props;
        const fields = this.state.fields.map((id, i) => {
            return (<Field
                name={"upload"+id}
                component={formUtils.renderUploadField}
                renderAdd={(this.props.multiLastOnly && i == this.state.fields.length - 1) || !this.props.multiLastOnly}
                handleAddField={this.handleAddField}
                renderRemove={this.state.fields.length > 1}
                multiple
                handleRemoveField={this.handleRemoveField.bind(this, id)}
                key={id}
                id={'' + id}
            />)
        })
        return (
            <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                {fields}
            </Form>
        )
    }

}

MultipleUploadFileFields.propTypes = {
    multiLastOnly: PropTypes.bool,
    submitted: PropTypes.func.isRequired,
    //override default name of redux-form
    form: PropTypes.string,
}

MultipleUploadFileFields.defaultProps = {
    multiLastOnly: true,

}
export default reduxForm({form: 'multipleUploadForm'})(MultipleUploadFileFields);