import PropTypes from 'prop-types'
import React from 'react'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import {
    Toolbar,
    ToolbarTitle,
    ToolbarGroup,
    ToolbarSeparator,
} from 'material-ui/Toolbar'
import { Link } from 'react-router-dom'

const styles = {
    backgroundColor: 'white',
    marginBottom: '12px',
    flexWrap: 'wrap',
    minHeight: '56px',
    height: 'auto',
}

const BackLink = ({ backLink }) => {
    if (!backLink) {
        return null
    }
    switch (typeof backLink) {
        case 'string':
            return (
                <Link to={backLink}>
                    <IconButton>
                        <FontIcon className="material-icons">
                            arrow_back
                        </FontIcon>
                    </IconButton>
                </Link>
            )
        case 'function':
            return (
                <IconButton onClick={backLink}>
                    <FontIcon className="material-icons">arrow_back</FontIcon>
                </IconButton>
            )
    }
}
BackLink.propTypes = {
    backLink: PropTypes.any,
}

const SubHeader = ({ title, backLink, children, style }) => (
    <Toolbar style={{ ...styles, ...style }}>
        {title || backLink ? (
            <ToolbarGroup>
                <BackLink backLink={backLink} />
                {backLink ? (
                    <ToolbarSeparator style={{ marginRight: '24px' }} />
                ) : null}
                <ToolbarTitle text={title} />
            </ToolbarGroup>
        ) : null}
        {children}
    </Toolbar>
)

SubHeader.propTypes = {
    backLink: PropTypes.any,
    title: PropTypes.string,
}
export default SubHeader
