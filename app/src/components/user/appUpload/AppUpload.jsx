import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Card, CardText } from 'material-ui/Card';
//import CardText from 'react-toolbox/lib/card/CardText';
import Button from 'material-ui/FlatButton';
//import Input from 'react-toolbox/lib/input/Input';
//import Dropdown from 'react-toolbox/lib/dropdown/Dropdown';

class UserView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            appName: '',
            description: '',
            developerName: '',
            developerEmail: '',
            version: '',
            minVer: '',
            maxVer: '',
        }
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload() {
        const data = {
                name: this.state.appName,
                description: this.state.description,
                developer: {
                    name: this.state.developerName,
                    email: this.state.developerEmail
                },
                versions: [{version: this.state.version,
                    minDhisVersion: this.state.minDhisVersion,
                    maxDhisVersion: this.state.maxDhisVersion
                }]
            }
        const fileInput = this.file.refs.wrappedInstance.inputNode.files[0];

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

    handleChange(name, value) {
        console.log(value)
        this.setState({
            ...this.state,
            [name]: value,
        });
    }

    render() {
        const appTypes = [{value: 'APP_STANDARD', label: 'Standard'}, {value: 'APP_DASHBOARD', label: 'Dashboard'},
            {value: 'APP_TRACKER_DASHBOARD', label: 'Tracker Dashboard'}]
        return (
            <div>
                <h2>Upload App</h2>
            <Card>
                <CardText>
                <Input type='text' required label='App name' name='appName' value={this.state.appName} onChange={this.handleChange.bind(this,'appName')} />
                <Input type='text' name="description" multiline label='Description' value={this.state.description} onChange={this.handleChange.bind(this,'description')}/>
                <Input type='text' name="developerName" label='Developer' value={this.state.developerName} onChange={this.handleChange.bind(this,'developerName')} />
                <Input type='email' label='Developer Email' value={this.state.developerEmail} onChange={this.handleChange.bind(this,'developerEmail')} />
                <Input type='text' label='Version' value={this.state.version} onChange={this.handleChange.bind(this,'version')} />
                <Input type='text' label='Min DHIS version' value={this.state.minVer} onChange={this.handleChange.bind(this,'minVer')} />
                <Input type='text' label='Max DHIS version' value={this.state.maxVer} onChange={this.handleChange.bind(this,'maxVer')} />
                <Input type='file' required onChange={this.handleChange.bind(this,'file')} ref={(file) => {this.file = file}}/>
                <Dropdown label="App type" auto source={appTypes} value={appTypes[0].value} />
                <Button accent raised icon="file_upload" name="app" onClick={this.handleUpload}>Upload</Button>
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

export default connect(mapStateToProps, null)(UserView);
