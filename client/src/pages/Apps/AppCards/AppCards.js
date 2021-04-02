import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import AppCardItem from './AppCardItem/AppCardItem'
import styles from './AppCards.module.css'

const AppCards = ({ isLoading, error, apps }) => {
    if (error) {
        return (
            <NoticeBox title={'Error loading apps'} error>
                {error}
            </NoticeBox>
        )
    }

    if (isLoading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (apps.length == 0) {
        return (
            <p className={styles.emptyApps}>
                We couldn't find any apps that match your criteria.
            </p>
        )
    }

    return (
        <div className={styles.appCards}>
            {apps.map(app => (
                <AppCardItem
                    key={app.id}
                    id={app.id}
                    name={app.name}
                    developer={app.developer}
                    type={app.appType}
                    description={app.description}
                    images={app.images}
                />
            ))}
        </div>
    )
}

AppCards.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    apps: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.string,
}

export default AppCards
