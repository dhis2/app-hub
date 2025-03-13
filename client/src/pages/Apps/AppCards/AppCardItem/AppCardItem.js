import PropTypes from 'prop-types'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import styles from './AppCardItem.module.css'
import config from 'config'
import AppIcon from 'src/components/AppIcon/AppIcon'
import PluginTag from '../../../../components/PluginTag/PluginTag'

const AppCardItem = ({
    id,
    name,
    developer,
    appType,
    description,
    images,
    hasPlugin,
    pluginType,
}) => {
    const logo = images.find((elem) => elem.logo)

    return (
        <Link data-test="appcard" to={`/app/${id}`} className={styles.appCard}>
            <header className={styles.appCardHeader}>
                <AppIcon src={logo?.imageUrl} />

                <div>
                    <h2 data-test="appcard-name" className={styles.appCardName}>
                        {name}
                    </h2>
                    <span
                        data-test="appcard-organisation"
                        className={styles.appCardDeveloper}
                    >
                        {developer.organisation || 'Unspecified'}
                    </span>
                    <div className={styles.appTypeContainer}>
                        <span className={styles.appCardType}>
                            {config.ui.appTypeToDisplayName[appType]}
                        </span>

                        {hasPlugin && (
                            <PluginTag
                                hasPlugin={hasPlugin}
                                pluginType={pluginType}
                            />
                        )}
                    </div>
                </div>
            </header>

            <div
                data-test="appcard-description"
                className={styles.appCardDescription}
            >
                <Summary>
                    <ReactMarkdown
                        allowedElements={['p']}
                        unwrapDisallowed={false}
                    >
                        {description}
                    </ReactMarkdown>
                </Summary>
            </div>
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
    appType: PropTypes.string.isRequired,
    developer: PropTypes.shape({
        name: PropTypes.string,
        organisation: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    hasPlugin: PropTypes.bool,
    images: PropTypes.array,
    pluginType: PropTypes.string,
}

export default AppCardItem
