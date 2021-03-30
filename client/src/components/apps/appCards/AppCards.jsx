import PropTypes from 'prop-types'
import React from 'react'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui-core'
import AppCardItem from './AppCardItem'
import styles from './AppCards.module.css'

const AppCards = ({ isLoading, error, apps }) => {
    if (error) {
        return (
            <NoticeBox title={'Error'} error>
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
        <div>
            {apps.map(app => (
                <div key={app.id}>
                    <AppCardItem app={app} />
                </div>
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
