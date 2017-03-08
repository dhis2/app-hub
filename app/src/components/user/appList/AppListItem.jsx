import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import { withRouter } from 'react-router';
import { appTypesToUI } from '../../../constants/apiConstants';

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
        alt: 'Pending',
        elem: (<FontIcon title="Pending" style={appStatusStyle}  className="material-icons">priority_high</FontIcon>),
    },
    NOT_APPROVED: {
        alt: 'Rejected',
        elem: (<FontIcon title="Rejected" style={appStatusStyle} className="material-icons">do_not_disturb_alt</FontIcon>),
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
    const {id, name, developer, description, appType, status} = props.app;
    const approved = (<FontIcon className="material-icons">check</FontIcon>)
    const pending = (<FontIcon className="material-icons">priority_high</FontIcon>)
    const rejected = (<FontIcon className="material-icons">do_not_disturb_alt</FontIcon>)
    const menu = (
        <IconMenu
            style={{top: rightIconsStyle['top']}}
            iconButtonElement={<IconButton><FontIcon className="material-icons">more_vert</FontIcon></IconButton>}>
            {status === 'APPROVED' ? <MenuItem onTouchTap={props.handleReject} primaryText="Reject"/> :
                <MenuItem onTouchTap={props.handleApprove} primaryText="Approve"/>}
            {props.isManager &&
            <MenuItem onTouchTap={props.handleDelete} primaryText="Delete"/> }
        </IconMenu>
    )

    const listItemProps = {
        primaryText: (<div style={{display: 'flex', alignItems: 'center'}}>{name} {appStatus[status].elem}</div>),
        leftAvatar: (<Avatar src="https://avatars1.githubusercontent.com/u/13482715?v=3&s=400"/>),
        secondaryText: (<p>{developer.name} <br /> {appTypesToUI[appType]} </p>),
        secondaryTextLines: 2,
        rightIconButton: props.isManager ? menu : null,
        onTouchTap: () => props.push(`${props.match.url}/app/${id}`)
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