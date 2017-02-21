import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {ListItem} from 'material-ui/List';
import {withReactRouterLink} from '../../utils/RRHOC';
import FontIcon from 'material-ui/FontIcon';
const RRListItem = withReactRouterLink(ListItem);
import Avatar from 'material-ui/Avatar';

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

const AppListItem = (props, state) => {
    const {id, appName, developer, description, appType, status} = props.app;

    const approved = (<FontIcon className="material-icons">check</FontIcon>)
    const pending = (<FontIcon className="material-icons">priority_high</FontIcon>)
    const rejected = (<FontIcon className="material-icons">do_not_disturb_alt</FontIcon>)

    return (
        <Link to={`#/${id}`}>
            <ListItem primaryText={appName}
                      leftAvatar={<Avatar src="https://avatars1.githubusercontent.com/u/13482715?v=3&s=400"/>}
                      secondaryText={appType} rightIcon={appStatus[status].elem}/>
        </Link>

    )
}


export default AppListItem;