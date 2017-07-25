import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import AppLogo from '../../appView/AppLogo'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import {withRouter} from 'react-router';
import {appTypesToUI} from '../../../../config';

const appStatusStyle = {
    fontSize: '16px',
    marginLeft: '10px',
}

const appStatus = {
    APPROVED: {
        alt: 'Approved',
        elem: (<FontIcon title="Approved" style={appStatusStyle} className="material-icons">check</FontIcon>),
    },
    PENDING: {
        alt: 'Pending approval',
        elem: (<FontIcon title="Pending" style={appStatusStyle} className="material-icons">priority_high</FontIcon>),
    },
    NOT_APPROVED: {
        alt: 'Rejected',
        elem: (
            <FontIcon title="Rejected" style={appStatusStyle} className="material-icons">do_not_disturb_alt</FontIcon>),
    },
}

const rightIconsStyle = {
    position: 'absolute',
    top: '0px',
    right: '70px',
    height: '48px',
    display: 'flex',
    alignItems: 'center'
}


const AppListItem = (props, state) => {
    const {id, name, developer, description, appType, status, images} = props.app;
    let menuItems = null;

    if(props.isManager){
        const approveItem = (<MenuItem onTouchTap={props.handleApprove} key="approve" primaryText="Approve"/>)
        const rejectItem =  (<MenuItem onTouchTap={props.handleReject} key="reject" primaryText="Reject"/>)
        const pendingItems = [approveItem, rejectItem]
        if(status === 'PENDING') {
            menuItems = pendingItems
        } else if(status === 'APPROVED') {
            menuItems = rejectItem;
        } else {
            menuItems = approveItem;
        }
    }

    const menu = (
        <IconMenu
            style={{top: rightIconsStyle['top']}}
            iconButtonElement={<IconButton><FontIcon className="material-icons">more_vert</FontIcon></IconButton>}>
            {menuItems}
            <MenuItem onTouchTap={props.handleDelete} primaryText="Delete"/>
        </IconMenu>
    )
    let logo = images.filter(elem => elem.logo)[0];
    const secondaryText = (
        <p style={{display: 'inline-block', height: 'auto'}}>{developer.name} <br />
            {appTypesToUI[appType]}
            {!props.manager ? (<span><br />Status: {appStatus[status].alt}</span>) : null}
        </p>)
    const listItemProps = {
        primaryText: (<div style={{display: 'flex', alignItems: 'center', fontWeight: '400'}}>{name} {appStatus[status].elem}</div>),
        leftAvatar: (<AppLogo logo={logo} inList/>),
        secondaryText: secondaryText,
        secondaryTextLines: 2,
        rightIconButton: props.isManager ? menu : null,
        onTouchTap: () => props.history.push(`${props.match.url}/app/${id}`)
    }

    return (
        <ListItem {...listItemProps} />

    )
}

AppListItem.propTypes = {
    app: PropTypes.object.isRequired,
    handleApprove: PropTypes.func.isRequired,
    handleReject: PropTypes.func,
    handleDelete: PropTypes.func,
    isManager: PropTypes.bool,
}
export default withRouter(AppListItem);