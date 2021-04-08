import { Card, Button, Divider } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import sharedStyles from '../UserApp.module.css'
import styles from './DetailsCard.module.css'
import config from 'config'
import AppDescription from 'src/components/AppDescription/AppDescription'
import AppIcon from 'src/components/AppIcon/AppIcon'

const { appTypeToDisplayName } = config.ui

const DetailsCard = ({ app }) => {
    const logo = app.images.find(img => img.logo)
    const appDeveloper = app.developer.organisation || app.developer.name
    const appType = appTypeToDisplayName[app.appType]

    const EditButton = ({ children }) => (
        <Link
            to={`/user/app/${app.id}/edit`}
            tabIndex="-1"
            className={styles.editButton}
        >
            <Button small secondary>
                {children}
            </Button>
        </Link>
    )

    return (
        <Card className={sharedStyles.card}>
            <section className={styles.detailsCardHeader}>
                <div>
                    <AppIcon src={logo?.imageUrl} />
                    <Link
                        to={`/user/app/${app.id}/logo/edit`}
                        tabIndex="-1"
                        className={styles.editLogoButton}
                    >
                        <Button small secondary>
                            Edit logo
                        </Button>
                    </Link>
                </div>
                <div>
                    <div>
                        <h2 className={styles.detailsCardName}>{app.name}</h2>
                        <EditButton>Edit name</EditButton>
                    </div>
                    <span className={styles.detailsCardDeveloper}>
                        by {appDeveloper}
                    </span>
                    <div>
                        <span className={styles.detailsCardType}>
                            {appType}
                        </span>
                        <EditButton>Edit app type</EditButton>
                    </div>
                </div>
            </section>
            <Divider />
            <section>
                <h2 className={sharedStyles.cardHeader}>Description</h2>
                <div style={{ display: 'flex' }}>
                    <div style={{ maxWidth: 640, marginRight: 8 }}>
                        {app.description ? (
                            <AppDescription
                                description={app.description}
                                paragraphClassName={
                                    styles.appDescriptionParagraph
                                }
                            />
                        ) : (
                            <em>No description provided</em>
                        )}
                    </div>
                    <EditButton>Edit description</EditButton>
                </div>
            </section>
            <Divider />
            <section>
                <h2 className={sharedStyles.cardHeader}>Source code URL</h2>
                <span style={{ marginRight: 8 }}>
                    {app.sourceUrl ? (
                        <a href="{app.sourceUrl}">{app.sourceUrl}</a>
                    ) : (
                        <em>No source code URL provided</em>
                    )}
                </span>
                <EditButton>Edit source code URL</EditButton>
            </section>
        </Card>
    )
}

DetailsCard.propTypes = {
    app: PropTypes.object.isRequired,
}

export default DetailsCard
