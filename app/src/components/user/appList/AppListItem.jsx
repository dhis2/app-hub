import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {ListItem} from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

const appStatus = {
    APPROVED: {
        alt: 'Approved',
        elem: (<FontIcon title="Approved" className="material-icons">check</FontIcon>),
    },
    PENDING: {
        alt: 'Pending',
        elem: (<FontIcon title="Pending" className="material-icons">priority_high</FontIcon>),
    },
    NOT_APPROVED: {
        alt: 'Rejected',
        elem: (<FontIcon title="Rejected" className="material-icons">do_not_disturb_alt</FontIcon>),
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
    const {id, appName, developer, description, appType, status} = props.app;
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
        primaryText: appName,
        leftAvatar: (<Avatar src="https://avatars1.githubusercontent.com/u/13482715?v=3&s=400"/>),
        secondaryText: (<p>{developer.developerName} <br /> {appType} </p>),
        secondaryTextLines: 2,
        rightIconButton: props.isManager ? menu : null,
    }

    return (
        <Link to={`#/${id}`}>
            <ListItem {...listItemProps} >
                <div style={rightIconsStyle}>
                    {appStatus[status].elem}
                </div>
            </ListItem>
        </Link>

    )
}

AppListItem.propTypes = {
    app: PropTypes.object.isRequired,
    handleApprove: PropTypes.func.isRequired,
    handleReject: PropTypes.func,
    isManager: PropTypes.bool,
}
export default AppListItem;