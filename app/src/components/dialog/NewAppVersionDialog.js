import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import DialogBase from './DialogBase';
import { addAppVersion } from '../../actions/actionCreators';

export class NewAppVersionDialog extends Component {

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

    handleNamespaceInput(event) {
        const val = event.target.value;
        this.setState({
            namespaceError: this.validate(val),
            namespaceValue: event.target.value,
        });
    }

    handleKeyInput(event) {
        const val = event.target.value;
        this.setState({
            keyError: this.validate(val),
            keyValue: event.target.value,
        });
    }

    handleClose() {
        this.props.closeDialog();
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
     /*   const { namespaceValue, keyValue } = this.state;
        const file = this.refs.file.input.files[0];
        if (namespaceValue && keyValue) {
            this.props.createNamespace(namespaceValue, keyValue);
        } else {
            this.setState({
                minVersionError: this.validate(keyValue),
                namespaceError: this.validate(namespaceValue),
            });
        } */
        console.log(this.props.app)
        this.props.addVersion({
            version: this.state.version,
            minDhisVersion: this.state.minVer,
            maxDhisVersion: this.state.maxVer,
        },this.refs.file.input.files[0], this.props.app.id);
    }

    validate(value) {
        return value ? '' : 'Invalid Input. Field required';
    }

    render() {
        const fieldStyle = {
            display: 'block',
            width: '100%',
        };
        return (
            <DialogBase
                title="New App Version"
                approveAction={this.handleCreate.bind(this)}
                cancelAction={this.props.closeDialog}
                contentStyle={{ maxWidth: '500px' }}
            >
                <TextField ref="version" hintText="Version" autoFocus style={fieldStyle}
                    errorText={this.state.versionError}
                    onChange={this.handleInput.bind(this, 'version')}
                />
                <TextField ref="minVer" hintText="Min DHIS version" style={fieldStyle}
                           errorText={this.state.minVersionError}
                           onChange={this.handleInput.bind(this, 'minVer')}
                />
                <TextField ref="maxVer" hintText="Max DHIS version" style={fieldStyle}
                           errorText={this.state.maxVersionError}
                           onChange={this.handleInput.bind(this, 'maxVer')}
                />
                <TextField id="fileinput" ref="file" hintText="" style={fieldStyle}
                           type="file"
                    errorText={this.state.fileError}
                />
            </DialogBase>
        );
    }
}

NewAppVersionDialog.propTypes = {
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
)(NewAppVersionDialog);
