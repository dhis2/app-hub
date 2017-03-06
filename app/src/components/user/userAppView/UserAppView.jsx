import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardText, CardTitle, CardHeader } from 'material-ui/Card';
import { Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { appLoad, openDialog, deleteAppVersion } from '../../../actions/actionCreators';
import * as dialogType from '../../../constants/dialogTypes';
import VersionList from '../../appVersion/VersionList';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import CustomForm from '../../../form/CustomForm';
import CustomFormField from '../../../form/CustomFormField';
import TextField from 'material-ui/TextField';
import MultipleUploadFileFields from '../../form/MultipleUploadFileFields';
class UserAppView extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.loadApp({appId: this.props.match.params.appId})
    }

    handleOpenDialog() {
        this.props.openNewVersionDialog({app: this.props.app});
    }

    handleOpenEditApp() {
        this.props.openEditAppDialog({app: this.props.app});
    }

    handleDeleteAppVersion(version) {
        this.props.deleteVersion(version, this.props.app.id);
    }
    render() {
        console.log(this.props)
        const app = this.props.app;
        if(!app) {
            return null;
        }
        const FABStyle = {
            margin: 0,
            top: 0,
            right: 10,
            top: '-25px',
            position: 'absolute',
        };
        const rightIconButtonStyle = {
            position: 'absolute',
            top: 0,
            right: '4px'
        }
        return (
            <div>
                <Toolbar style={{backgroundColor: 'white', marginBottom: '10px'}}>
                    <ToolbarGroup>
                        <ToolbarTitle text="App Overview"/>
                    </ToolbarGroup>

                </Toolbar>
                <Card>
                    <CardHeader title={app.name} avatar={"https://avatars1.githubusercontent.com/u/13482715?v=3&s=400"}
                    subtitle={app.developer.name}>
                        <IconButton style={rightIconButtonStyle} onClick={this.handleOpenEditApp.bind(this)}>
                            <FontIcon className="material-icons">edit</FontIcon>
                        </IconButton>
                    </CardHeader>
                    <CardText>
                        {app.description}
                    </CardText>

                </Card>
                <Card style={{marginTop: '10px', position: 'relative'}}>
                    <FloatingActionButton mini={true} style={FABStyle} onTouchTap={this.handleOpenDialog.bind(this)}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <CardTitle title="Versions" />
                    <CardText>
                        <VersionList editable versionList={app.versions} app={app} handleDelete={this.handleDeleteAppVersion.bind(this)}/>
                    </CardText>
                </Card>
                <Card style={{marginTop: '10px', position: 'relative'}} expandable={true} expanded={false}>
                    <FloatingActionButton mini={true} style={FABStyle} onTouchTap={this.handleOpenDialog.bind(this)}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <CardTitle title="Images" actAsExpander={true}/>
                    <CardText>
                        <MultipleUploadFileFields/>

                    </CardText>
                </Card>
            </div>
        )
    }
}

UserAppView.propTypes = {

}

const mapStateToProps = (state, ownProps) => ({
   app: state.user.appList[ownProps.match.params.appId]
})

const mapDispatchToProps = (dispatch) =>  ({
    loadApp(appid) {
        dispatch(appLoad(appid));
    },

    deleteVersion(version,appId) {
        dispatch(deleteAppVersion(version, appId))
    },

    openNewVersionDialog(dialogProps) {
        dispatch(openDialog(dialogType.NEW_VERSION, dialogProps))
    },

    openEditAppDialog(dialogProps) {
        dispatch(openDialog(dialogType.EDIT_APP, dialogProps))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(UserAppView);