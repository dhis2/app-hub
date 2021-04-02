import { Tag } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './AppCard.module.css'
import AppIcon from 'src/components/AppIcon/AppIcon'
import {
    APP_STATUS_APPROVED,
    APP_STATUS_PENDING,
    APP_STATUS_REJECTED,
} from 'src/constants/apiConstants'
import { relativeTimeFormat } from 'src/lib/relative-time-format'

const appCardActionForStatus = appStatus => {
    switch (appStatus) {
        case APP_STATUS_APPROVED:
            return 'Updated'
        case APP_STATUS_PENDING:
            return 'Uploaded'
        case APP_STATUS_REJECTED:
            return 'Reviewed'
    }
}

const appStatusToCardText = appStatus => {
    switch (appStatus) {
        case APP_STATUS_APPROVED:
            return 'Available'
        case APP_STATUS_PENDING:
            return 'Waiting for approval'
        case APP_STATUS_REJECTED:
            return 'Rejected'
    }
}

const AppCard = ({ app }) => {
    const logo = app.images.find(i => i.logo)
    const actionForStatus = appCardActionForStatus(app.status)
    const actionRelativeTime = relativeTimeFormat(
        Math.max(...app.versions.map(v => v.created))
    )

    return (
        <Link to={`/user/app/${app.id}`} className={styles.appCardLink}>
            <div className={styles.appCard}>
                <div>
                    <AppIcon src={logo?.imageUrl} />
                </div>
                <div>
                    <h3 className={styles.appCardName}>{app.name}</h3>
                    <div
                        className={styles.appCardAction}
                    >{`${actionForStatus} ${actionRelativeTime}`}</div>
                    <div>
                        <Tag
                            positive={app.status === APP_STATUS_APPROVED}
                            negative={app.status === APP_STATUS_REJECTED}
                        >
                            {appStatusToCardText(app.status)}
                        </Tag>
                    </div>
                </div>
            </div>
        </Link>
    )
}

AppCard.propTypes = {
    app: PropTypes.object.isRequired,
}

export default AppCard
