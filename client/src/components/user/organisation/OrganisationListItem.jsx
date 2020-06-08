import PropTypes from 'prop-types'
import React from 'react'
import { ListItem } from 'material-ui/List'
import { withRouter } from 'react-router'

const AppListItem = props => {
    const { id, name } = props.organisation

    const listItemProps = {
        primaryText: name,
        // primaryText: (
        //     <div
        //         style={{
        //             display: 'flex',
        //             alignItems: 'center',
        //             fontWeight: '400',
        //         }}
        //     >
        //         {name}
        //     </div>
        // ),
        //leftAvatar: <AppLogo logo={logo} inList />,
        // secondaryText: secondaryText,
        // secondaryTextLines: 2,
        //rightIconButton: props.isManager ? menu : null,
        onTouchTap: () => props.history.push(`${props.match.url}/${id}`),
    }

    return <ListItem {...listItemProps} />
}

AppListItem.propTypes = {
    app: PropTypes.object.isRequired,
    handleApprove: PropTypes.func.isRequired,
    handleReject: PropTypes.func,
    isManager: PropTypes.bool,
}
export default withRouter(AppListItem)
