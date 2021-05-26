import PropTypes from 'prop-types'
import React from 'react'
import { ListItem } from 'material-ui/List'
import { withRouter } from 'react-router'

const OrganisationListItem = props => {
    const { slug, name } = props.organisation

    const listItemProps = {
        primaryText: name,
        onClick: () => props.history.push(`${props.match.url}/${slug}`),
    }

    return <ListItem {...listItemProps} />
}

OrganisationListItem.propTypes = {
    isManager: PropTypes.bool,
    organisation: PropTypes.object,
}
export default withRouter(OrganisationListItem)
