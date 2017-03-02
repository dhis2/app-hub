import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import DialogBase from './DialogBase';
import { addAppVersion } from '../../actions/actionCreators';
import CustomForm from '../../form/CustomForm';
import CustomFormField from '../../form/CustomFormField';

export class EditAppDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            version: '',
            minVersion: '',
            maxVersion: '',
            file: '',
            versionError: '',
            minVersionError: '',
            maxVersionError: '',
            fileError: '',
        };
        this.validate = this.validate.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }


    handleInput(name, e) {
        const value = e.target.value;
        console.log(this.refs)
        this.setState({
            ...this.state,
            [name]: value,
        })
    }

    handleCreate() {

    }

    validate(value) {
        return value ? '' : 'Invalid Input. Field required';
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
                approveAction={this.handleCreate.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{ maxWidth: '500px' }}
            >
                <CustomForm>
                    <CustomFormField name="AppName" defaultValue={app.name} floatingLabelText="App name" floatingLabelFixed />
                </CustomForm>
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
    addVersion(appVersion, file, id) {
       dispatch(addAppVersion(appVersion,file, id))
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditAppDialog);
