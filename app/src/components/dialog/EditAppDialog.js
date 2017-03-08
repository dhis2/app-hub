import React, {PropTypes, Component} from 'react';
import TextField from 'material-ui/TextField';
import {connect} from 'react-redux';
import DialogBase from './DialogBase';
import {editApp} from '../../actions/actionCreators';
import CustomForm from '../../form/CustomForm';
import CustomFormField from '../../form/CustomFormField';
import EditAppForm from '../form/EditAppForm';

export class EditAppDialog extends Component {

    constructor(props) {
        super(props);

    }

    submitForm() { //submit form manually as dialog actions work as submit button
        const res = this.form.submit();
        if(this.form.valid) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res)
        }
    }

    handleCreate(values) {
        this.props.editApp(this.props.app, values.data);

    }

    render() {
        const fieldStyle = {
            display: 'block',
            width: '100%',
        };
        const app = this.props.app;
        return (
            <DialogBase
                title="Edit App"
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{maxWidth: '500px'}}
                bodyStyle={{overflowY:'scroll'}}
            >
                <EditAppForm initialValues={{
                    appName: app.name,
                    description: app.description,
                    appType: app.appType,
                    developerName: app.developer.name,
                    developerEmail: app.developer.email,
                    developerAddress: app.developer.address,
                    developerOrg: app.developer.organisation,
                }} ref={(ref) => {this.form = ref; }}
                submitted={this.handleCreate.bind(this)}/>

            </DialogBase>
        );
    }
}

EditAppDialog.propTypes = {
    app: PropTypes.object,
    appId: PropTypes.string,
    addVersion: PropTypes.func,
};

const mapStateToProps = state => ({
    app: state.dialog.dialogProps.app,
});

const mapDispatchToProps = dispatch => ({
    editApp(app, data) {
        dispatch(editApp(app, data))
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditAppDialog);
