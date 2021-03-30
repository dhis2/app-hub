// eslint-disable-next-line react/no-deprecated
import PropTypes from 'prop-types'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardTitle, CardHeader } from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import {
    loadUserApp,
    addImageToApp,
    openDialog,
    deleteAppVersion,
    addMultipleImagesToApp,
    setAppApproval,
} from '../../../actions/actionCreators'
import * as dialogType from '../../../constants/dialogTypes'
import VersionListEdit from '../../appVersion/VersionListEdit'
import FontIcon from 'material-ui/FontIcon'
import LogoAvatar from '../../appView/AppLogo'
import IconButton from 'material-ui/IconButton'
import Subheader from '../../header/SubHeader'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import Theme from '../../../styles/theme'
import config from '../../../../config'
import * as selectors from '../../../selectors/userSelectors'
import MultipleUploadFileFields from '../../form/MultipleUploadFileFields'
import ImageViewer from '../../appView/ImageViewer'
import {
    APP_STATUS_APPROVED,
    APP_STATUS_PENDING,
    APP_STATUS_REJECTED,
} from '../../../constants/apiConstants'

class UserAppView extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.loadApp({ appId: this.props.match.params.appId })
    }

    handleOpenDialog() {
        this.props.openNewVersionDialog({ app: this.props.app })
    }

    handleOpenEditApp() {
        this.props.openEditAppDialog({ app: this.props.app })
    }

    handleDeleteAppVersion(version) {
        const children = (
            <div>
                <p>
                    Are you sure you want to delete version{' '}
                    <i>{version.version} </i>
                    for app &#39;{this.props.app.name}&#39;?
                </p>
                This cannot be undone.
            </div>
        )
        this.props.openConfirmDeleteVersion({
            children,
            approveAction: () =>
                this.props.deleteVersion(version, this.props.app.id),
        })
    }

    handleUploadImages(mergedFilesArray) {
        const images = mergedFilesArray.map(image => {
            const imageObj = {
                image: {
                    caption: '',
                    description: '',
                    logo: false,
                },
                file: image,
            }
            return imageObj
        })
        if (images.length < 1) {
            throw new Error('No images')
        }
        this.props.addImagesToApp(this.props.app.id, images)
    }

    handleEditVersion(version) {
        this.props.editVersion({
            appId: this.props.app.id,
            appVersion: version,
        })
    }

    handleSetAppApproval(status) {
        this.props.setAppApproval(this.props.app, status)
    }

    render() {
        const app = this.props.app
        if (!app) {
            return null
        }
        const FABStyle = {
            margin: 0,
            right: 10,
            top: '-26px',
            position: 'absolute',
        }

        const cardStyle = {
            marginTop: '12px',
            position: 'relative',
        }

        return (
            <div>
                <Subheader title="App overview" backLink="/user" />
                <Card>
                    <UserAppCardHeader
                        app={app}
                        appLogo={this.props.appLogo}
                        isManager={this.props.user.manager}
                        onAppApproval={this.handleSetAppApproval.bind(this)}
                        onOpenEditApp={this.handleOpenEditApp.bind(this)}
                    />

                    <CardText
                        style={Theme.paddedCard}
                        className="multiline-content"
                    >
                        {app.description}
                    </CardText>
                </Card>
                <Card style={cardStyle}>
                    <FloatingActionButton
                        mini={true}
                        style={FABStyle}
                        title="New version"
                        onClick={this.handleOpenDialog.bind(this)}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                    <CardTitle title="Versions" />
                    <CardText>
                        <VersionListEdit
                            editable
                            versionList={app.versions}
                            app={app}
                            handleEdit={this.handleEditVersion.bind(this)}
                            handleDelete={this.handleDeleteAppVersion.bind(
                                this
                            )}
                        />
                    </CardText>
                </Card>
                <Card style={cardStyle} expandable={true} expanded={false}>
                    <CardTitle title="Images" actAsExpander={true} />
                    <CardText style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <ImageViewer
                            images={app.images}
                            appId={app.id}
                            editable
                        />
                    </CardText>
                    <CardText style={Theme.paddedCard}>
                        <h2>Upload images</h2>
                        <MultipleUploadFileFields
                            form="imageUpload"
                            submitted={this.handleUploadImages.bind(this)}
                        />
                    </CardText>
                </Card>
            </div>
        )
    }
}

UserAppView.propTypes = {
    addImagesToApp: PropTypes.func,
    app: PropTypes.object,
    appLogo: PropTypes.object,
    deleteVersion: PropTypes.func,
    editVersion: PropTypes.func,
    loadApp: PropTypes.func,
    match: PropTypes.object,
    openConfirmDeleteVersion: PropTypes.func,
    openEditAppDialog: PropTypes.func,
    openNewVersionDialog: PropTypes.func,
    setAppApproval: PropTypes.func,
    user: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
    app: selectors.getApp(state, ownProps.match.params.appId),
    user: selectors.getUserProfile(state),
    appLogo: selectors.getAppLogo(state, ownProps.match.params.appId),
})

const mapDispatchToProps = dispatch => ({
    loadApp(appid) {
        dispatch(loadUserApp(appid))
    },

    addImageToApp(appid, image) {
        dispatch(addImageToApp(appid, image))
    },

    addImagesToApp(appId, images) {
        dispatch(addMultipleImagesToApp(appId, images))
    },

    deleteVersion(version, appId) {
        dispatch(deleteAppVersion(version, appId))
    },

    openNewVersionDialog(dialogProps) {
        dispatch(openDialog(dialogType.NEW_VERSION, dialogProps))
    },

    openEditAppDialog(dialogProps) {
        dispatch(openDialog(dialogType.EDIT_APP, dialogProps))
    },
    editVersion(dialogProps) {
        dispatch(openDialog(dialogType.EDIT_VERSION, dialogProps))
    },

    openConfirmDeleteVersion(dialogProps) {
        dispatch(openDialog(dialogType.CONFIRM_GENERIC, dialogProps))
    },

    setAppApproval(app, status) {
        dispatch(setAppApproval(app, status))
    },
})

const UserAppCardHeader = ({
    app,
    onOpenEditApp,
    isManager,
    appLogo,
    onAppApproval,
}) => {
    const rightIconButtonStyle = {
        position: 'absolute',
        top: 0,
        right: '4px',
    }

    const cardHeaderRightStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: '-5px',
        color: Theme.card.subtitleColor,
    }

    const statusAlertPending = 'This app is pending approval'
    const statusAlertRejected = 'This app has been rejected'

    const statusAlertText = (
        <p style={cardHeaderRightStyle}>
            <FontIcon
                style={{ color: 'inherit', fontSize: 'inherit' }}
                className="material-icons"
            >
                priority_high
            </FontIcon>
            {app.status == APP_STATUS_PENDING
                ? statusAlertPending
                : statusAlertRejected}
        </p>
    )

    const subtitle = (
        <div>
            Type: {config.ui.appTypeToDisplayName[app.appType]} <br />
            Author: {app.developer.name} <br />
            Organisation: {app.developer.organisation} <br />
            {app.status == APP_STATUS_PENDING ||
            app.status == APP_STATUS_REJECTED
                ? statusAlertText
                : null}
        </div>
    )

    const editIconButton = (
        <IconButton style={rightIconButtonStyle} onClick={onOpenEditApp}>
            <i className="material-icons">edit</i>
        </IconButton>
    )

    if (isManager) {
        //Render a menu instead for managers

        let menuItems = null
        const approveItem = (
            <MenuItem
                onClick={() => onAppApproval(APP_STATUS_APPROVED)}
                key="approve"
                primaryText="Approve"
            />
        )
        const rejectItem = (
            <MenuItem
                onClick={() => onAppApproval(APP_STATUS_REJECTED)}
                key="reject"
                primaryText="Reject"
            />
        )
        const pendingItems = [approveItem, rejectItem]

        if (app.status === APP_STATUS_PENDING) {
            menuItems = pendingItems
        } else if (app.status === APP_STATUS_APPROVED) {
            menuItems = rejectItem
        } else {
            menuItems = approveItem
        }

        var menu = (
            <IconMenu
                style={rightIconButtonStyle}
                iconButtonElement={
                    <IconButton>
                        <FontIcon className="material-icons">
                            more_vert
                        </FontIcon>
                    </IconButton>
                }
            >
                {menuItems}
                <MenuItem
                    onClick={onOpenEditApp}
                    key="edit"
                    primaryText="Edit"
                />
            </IconMenu>
        )
    }

    return (
        <CardHeader
            title={app.name}
            avatar={<LogoAvatar logo={appLogo} />}
            subtitle={subtitle}
            titleStyle={{ fontSize: '2em' }}
        >
            {isManager ? menu : editIconButton}
        </CardHeader>
    )
}

UserAppCardHeader.propTypes = {
    app: PropTypes.object.isRequired,
    onOpenEditApp: PropTypes.func.isRequired,
    appLogo: PropTypes.object,
    isManager: PropTypes.bool,
    onAppApproval: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAppView)
