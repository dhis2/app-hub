import React, {PropTypes, Component} from 'react';
import TextField from 'material-ui/TextField';
import {connect} from 'react-redux';
import DialogBase from './DialogBase';
import {addAppVersion} from '../../actions/actionCreators';
import * as formUtils from '../form/ReduxFormUtils';
import UploadFileField from '../form/UploadFileField';
import NewAppVersionForm from '../form/NewAppVersionForm';
export class NewAppVersionDialog extends Component {

    constructor(props) {
        super(props);
    }


    submitForm() { //submit form manually as dialog actions work as submit button
        const res = this.form.submit();
        if (this.form.valid) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res)
        }
    }

    handleCreate(values) {
        this.props.addVersion(values.data, values.file, this.props.app.id);

    }

    render() {
        const fieldStyle = {
            display: 'block',
            width: '100%',
        };
        return (
            <DialogBase
                title="New App Version"
                approveLabel={'Upload'}
                approveAction={this.submitForm.bind(this)}
                cancelAction={this.props.closeDialog}>
                <NewAppVersionForm ref={ref => {
                    this.form = ref
                }} submitted={this.handleCreate.bind(this)}/>
            </DialogBase>
        );
    }
}

NewAppVersionDialog.propTypes = {
    app: PropTypes.object,
    appId: PropTypes.string,
    addVersion: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
    addVersion(appVersion, file, id) {
        dispatch(addAppVersion(appVersion, file, id))
    },
});

export default connect(
    null,
    mapDispatchToProps
)(NewAppVersionDialog);
