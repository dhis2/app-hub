import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FontIcon from 'material-ui/FontIcon'
import LogoAvatar from '../../appView/AppLogo'
import IconButton from 'material-ui/IconButton'
import Subheader from '../../header/SubHeader'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import { Card, CardText, CardTitle, CardHeader } from 'material-ui/Card'
import Theme from '../../../styles/theme'
import ErrorOrLoading from '../../utils/ErrorOrLoading'
import * as userSelectors from '../../../selectors/userSelectors'
import * as organisationSelectors from '../../../selectors/organisationSelectors'
import { removeOrganisationMember } from '../../../actions/actionCreators'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'
import { ListItem, List } from 'material-ui/List/'

class OrganisationMemberList extends Component {
    renderRow() {
        return (
            <TableRow>
                <TableRowColumn></TableRowColumn>
            </TableRow>
        )
    }

    render() {
        const { members, owner, organisation } = this.props
        const orgId = organisation.id
        return (
            <List>
                {members.map(user => (
                    <MemberListItem
                        user={user}
                        key={user.id}
                        isOwner={owner.id === user.id}
                        onRemove={() => this.props.removeOrganisationMember(orgId, user.id)}
                    />
                ))}
            </List>
        )
    }
}

const mapDispatch = {
    removeOrganisationMember,
}

function MemberListItemMenu(props) {
    return (
        <IconMenu>
            iconButtonElement=
            {
                <IconButton>
                    <FontIcon className="material-icons">more_vert</FontIcon>
                </IconButton>
            }
            <MenuItem></MenuItem>
            <MenuItem onClick={() => {}} primaryText="Remove" />
        </IconMenu>
    )
}

function MemberListItem(props) {
    const { user, isOwner } = props

    const memberListItemMenu = (
        <IconMenu
            iconButtonElement={
                <IconButton>
                    <FontIcon className="material-icons">more_vert</FontIcon>
                </IconButton>
            }
        >
            <MenuItem
                primaryText="Remove"
                disabled={isOwner}
                title={isOwner && 'Cannot remove the owner of the organisation'}
                onClick={!isOwner && props.onRemove}
            />
        </IconMenu>
    )
    return (
        <ListItem
            primaryText={
                <div>
                    {user.name}
                    {isOwner ? (
                        <FontIcon
                            title="Organisation Owner"
                            style={{ fontSize: 16, marginLeft: 4 }}
                            className="material-icons"
                        >
                            security
                        </FontIcon>
                    ) : null}
                </div>
            }
            secondaryText={user.email}
            rightIconButton={memberListItemMenu}
            hoverColor='none'
            style={{cursor: 'inherit'}}
        />
    )
    return (
        <TableRow>
            <TableRowColumn>{user.name}</TableRowColumn>
            <TableRowColumn>
                <IconButton>
                    <FontIcon className="material-icons">more_vert</FontIcon>
                </IconButton>
            </TableRowColumn>
        </TableRow>
    )
}

export default connect(null, mapDispatch)(OrganisationMemberList)
