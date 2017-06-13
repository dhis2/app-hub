import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Card, CardText, CardTitle, CardHeader} from 'material-ui/Card';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Button from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {loadUserApp, addImageToApp, openDialog, deleteAppVersion} from '../../../actions/actionCreators';
import * as dialogType from '../../../constants/dialogTypes';
import VersionList from '../../appVersion/VersionList';
import FontIcon from 'material-ui/FontIcon';
import LogoAvatar from '../../appView/AppLogo';
import IconButton from 'material-ui/IconButton';
import Subheader from '../../header/SubHeader';
import Theme from '../../../styles/theme';
import {appTypesToUI} from '../../../../config';
import MultipleUploadFileFields from '../../form/MultipleUploadFileFields';
import ImageViewer from '../../appView/ImageViewer';
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

    renderStatusAlert() {
        const cardHeaderRightStyle = {
            display: 'inline-flex',
            alignItems: 'center',
            marginLeft: '-5px',
            color: Theme.card.subtitleColor,
        }
        const statusAlertPending = "This app is pending approval"
        const statusAlertRejected = "This app has been rejected"

        return (<p style={cardHeaderRightStyle}><FontIcon style={{color: 'inherit', fontSize: 'inherit'}}
                                                            className="material-icons">priority_high</FontIcon>
            {this.props.app.status == 'PENDING' ? statusAlertPending : statusAlertRejected}
        </p>)
    }

    submitUploadImages() {

        this.form.submit();
    }

    handleUploadImages(fields) {
        for (let i = 0; i < fields.length; i++) {
            fields[i].map((image, i) => {
                const imageObj = {
                    image: {
                        caption: '',
                        description: '',
                        logo: false,
                    },
                    file: image
                }
                this.props.addImageToApp(this.props.app.id, imageObj);
            })
        }
    }

    render() {
        const app = this.props.app;
        if (!app) {
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

        const subtitle = (<div>Type: {appTypesToUI[app.appType]} <br />
            Author: {app.developer.name} <br />
            Organisation: {app.developer.organisation} <br />
            {app.status == 'PENDING' || app.status == 'NOT_APPROVED' ? this.renderStatusAlert.bind(this)() : null}</div>)

        let logo = app.images.filter(elem => elem.logo)[0];

        return (
            <div>
                <Subheader title="App overview" backLink="/user">
                </Subheader>
                <Card>
                    <CardHeader title={app.name} avatar={<LogoAvatar logo={logo}/>}
                                subtitle={subtitle} titleStyle={{fontSize: '2em'}}>
                        <IconButton style={rightIconButtonStyle} onClick={this.handleOpenEditApp.bind(this)}>
                            <i className="material-icons">edit</i>
                        </IconButton>

                    </CardHeader>

                    <CardText style={Theme.paddedCard} className="multiline-content">
                        {app.description}
                    </CardText>

                </Card>
                <Card style={{marginTop: '10px', position: 'relative'}}>
                    <FloatingActionButton mini={true} style={FABStyle} onTouchTap={this.handleOpenDialog.bind(this)}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <CardTitle title="Versions"/>
                    <CardText>
                        <VersionList editable versionList={app.versions} app={app}
                                     handleDelete={this.handleDeleteAppVersion.bind(this)}/>
                    </CardText>
                </Card>
                <Card style={{marginTop: '10px', position: 'relative'}} expandable={true} expanded={false}>
                    <CardTitle title="Images" actAsExpander={true}/>
                    <CardText style={{paddingLeft: 0, paddingRight: 0}}>
                        <ImageViewer images={app.images} appId={app.id} editable/>
                    </CardText>
                    <CardText>
                        <h2>Upload images</h2>
                        <MultipleUploadFileFields ref={ref => this.form = ref}
                                                  form="imageUpload"
                                                  submitted={this.handleUploadImages.bind(this)}/>
                        <Button primary onClick={this.submitUploadImages.bind(this)}
                                icon={<FontIcon className="material-icons">file_upload</FontIcon>}/>
                    </CardText>
                </Card>
            </div>
        )
    }
}

UserAppView.propTypes = {}

const mapStateToProps = (state, ownProps) => ({
    app: state.user.appList.byId[ownProps.match.params.appId]
})

const mapDispatchToProps = (dispatch) => ({
    loadApp(appid) {
        dispatch(loadUserApp(appid));
    },

    addImageToApp(appid, image) {
        dispatch(addImageToApp(appid, image));
    },

    deleteVersion(version, appId) {
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