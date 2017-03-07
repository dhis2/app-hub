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
import { createUploadOptions } from '../../../utils/uploadUtils';

class UserView extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(data) {
        console.log(data)

        const fetchOptions = createUploadOptions(data)
        console.log(fetchOptions);
        fetch('http://localhost:3099/api/apps', fetchOptions);
        return;

    }


    render() {
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
