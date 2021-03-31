import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Card,
    Divider,
} from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import { useQueryV1 } from 'src/api'
import AppIcon from 'src/components/AppIcon/AppIcon'
import styles from './AppView.module.css'
import Screenshots from './Screenshots/Screenshots'
import Versions from './Versions/Versions'
import classnames from 'classnames'
import config from 'config'

const AppView = ({ match }) => {
    const { appId } = match.params
    const { data: app, error } = useQueryV1(`apps/${appId}`)

    if (error) {
        return (
            <div className={styles.appCardContainer}>
                <CenteredContent>
                    <NoticeBox title={'Error loading app'} error>
                        {error.message || error.statusText}
                    </NoticeBox>
                </CenteredContent>
            </div>
        )
    }

    if (!app) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    const logo = app.images.find(img => img.logo)
    const screenshots = app.images.filter(img => !img.logo).map(i => i.imageUrl)
    const versions = app.versions.sort((a, b) => b.created - a.created)

    return (
        <div className={styles.appCardContainer}>
            <Card className={styles.appCard}>
                <section
                    className={classnames(
                        styles.appCardSection,
                        styles.appCardHeader
                    )}
                >
                    <AppIcon src={logo?.imageUrl} />
                    <div>
                        <h2 className={styles.appCardName}>{app.name}</h2>
                        <span className={styles.appCardDeveloper}>
                            by{' '}
                            {app.developer.organisation || app.developer.name}
                        </span>
                        <span className={styles.appCardType}>
                            {config.ui.appTypeToDisplayName[app.appType]}
                        </span>
                    </div>
                </section>
                <Divider />
                <section
                    className={styles.appCardSection}
                    style={{ maxWidth: 544 }}
                >
                    <h2 className={styles.appCardHeading}>About this app</h2>
                    <p className={styles.appCardPara}>
                        {app.description ||
                            'The developer of this app has not provided a description.'}
                    </p>
                </section>
                <Divider />
                <section className={styles.appCardSection}>
                    <h2 className={styles.appCardHeading}>Screenshots</h2>
                    <Screenshots screenshots={screenshots} />
                </section>
                <Divider />
                <section className={styles.appCardSection}>
                    <h2 className={styles.appCardHeading}>
                        All versions of this application
                    </h2>
                    <Versions versions={versions} />
                </section>
            </Card>
        </div>
    )
}

AppView.propTypes = {
    match: PropTypes.object.isRequired,
}

export default AppView
