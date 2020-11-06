import PropTypes from 'prop-types'
import React from 'react'
import { ListItem } from 'material-ui/List'
import { withRouter } from 'react-router'

const OrganisationListItem = props => {
    const { id, slug, name } = props.organisation

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
        onTouchTap: () => props.history.push(`${props.match.url}/${slug}`),
    }

    return <ListItem {...listItemProps} />
}

OrganisationListItem.propTypes = {
    organisation: PropTypes.object,
    isManager: PropTypes.bool,
}
export default withRouter(OrganisationListItem)
