import { Tag } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import styles from './AppCardItem.module.css'
import config from 'config'
import AppIcon from 'src/components/AppIcon/AppIcon'

const AppCardItem = ({
    id,
    name,
    developer,
    type,
    description,
    images,
    hasPlugin,
}) => {
    const logo = images.find((elem) => elem.logo)

    return (
        <Link to={`/app/${id}`} className={styles.appCard}>
            <header className={styles.appCardHeader}>
                <AppIcon src={logo?.imageUrl} />

                <div>
                    <h2 className={styles.appCardName}>{name}</h2>
                    <span className={styles.appCardDeveloper}>
                        {developer.organisation || 'Unspecified'}
                    </span>
                    <div className={styles.appTypeContainer}>
                        <span className={styles.appCardType}>
                            {config.ui.appTypeToDisplayName[type]}
                        </span>

                        {hasPlugin && <Tag neutral>Plugin</Tag>}
                    </div>
                </div>
            </header>

            <p className={styles.appCardDescription}>
                <Summary>
                    <ReactMarkdown
                        allowedElements={['p']}
                        unwrapDisallowed={false}
                    >
                        {description}
                    </ReactMarkdown>
                </Summary>
            </p>
        </Link>
    )
}

const Summary = ({ children }) => {
    return <div className={styles.summary}>{children}</div>
}

Summary.propTypes = {
    children: PropTypes.node,
}

AppCardItem.propTypes = {
    developer: PropTypes.shape({
        name: PropTypes.string,
        organisation: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
    hasPlugin: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string,
    images: PropTypes.array,
}

export default AppCardItem
