import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, CardText} from 'material-ui/Card';
import Button from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import UploadFileField from '../../form/UploadFileField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Field, reduxForm } from 'redux-form';
import UploadAppForm from '../../form/UploadAppForm';


class UserView extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        console.log(values)
        return;
        const data = {
            name: values.appName,
            description: values.description,
            developer: {
                name: values.developerName,
                email: values.developerEmail,
                address: values.developerAddress,
                organisation: values.developerOrg,
            },
            versions: [{
                version: values.version,
                minDhisVersion: values.minVer,
                maxDhisVersion: values.maxVer
            }],
            images: [{
                caption: '',
                description: '',
            }]
        }
        const fileInput = values.file;
        let form = new FormData();
        const file = new Blob([fileInput], {type: 'multipart/form-data'})
        const app = new Blob([JSON.stringify(data)], {type: 'application/json'})

        form.append('file', file, fileInput.name)
        form.append('app', app);

        const fetchOptions = {
            credentials: 'include',
            method: 'POST',
            body: form
        };
        fetch('http://localhost:3099/api/apps', fetchOptions)
    }

    handleChange(name, e) {
        const value = e.target.value;
        this.setState({
            ...this.state,
            [name]: value,
        });
    }

    handleUpload(file) {

    }

    handleSelectChange(e, index, value) {
        this.setState({
            ...this.state,
            appType: value
        })
    }

    render() {
        const appTypes = [{value: 'APP_STANDARD', label: 'Standard'}, {value: 'APP_DASHBOARD', label: 'Dashboard'},
            {value: 'APP_TRACKER_DASHBOARD', label: 'Tracker Dashboard'}]
        const menuItems = appTypes.map((type, i) => (
            <MenuItem key={type.value} value={type.value} primaryText={type.label}/>
        ));
        const sel = (<SelectField onChange={this.handleSelectChange.bind(this)}>
            {menuItems}
        </SelectField>)
        return (
            <div>
                <h2>Upload App</h2>
                <Card>
                    <CardText>
                        <UploadAppForm submitted={this.handleSubmit.bind(this)} />
                    </CardText>
                </Card>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
        appList: state.appsList.appList,
    });

const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, null)(
    UserView);
