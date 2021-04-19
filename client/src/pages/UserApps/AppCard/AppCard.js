import { Tag, Button } from '@dhis2/ui'
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

const AppCard = ({ app, showUploadButton, onApprove, onReject, onDelete }) => {
    const logo = app.images.find(i => i.logo)
    const actionForStatus = appCardActionForStatus(app.status)
    const actionTime = new Date(Math.max(...app.versions.map(v => v.created)))
    const actionRelativeTime = relativeTimeFormat(actionTime)

    return (
        <div className={styles.appCard}>
            <Link to={`/user/app/${app.id}`} className={styles.appCardLink}>
                <div>
                    <AppIcon src={logo?.imageUrl} />
                </div>
                <div>
                    <h3 className={styles.appCardName}>{app.name}</h3>
                    <div className={styles.appCardAction}>
                        {`${actionForStatus} `}
                        <span title={actionTime}>{actionRelativeTime}</span>
                    </div>
                    <div>
                        <Tag
                            positive={app.status === APP_STATUS_APPROVED}
                            negative={app.status === APP_STATUS_REJECTED}
                        >
                            {appStatusToCardText(app.status)}
                        </Tag>
                    </div>
                </div>
            </Link>
            <div className={styles.appCardActions}>
                {showUploadButton &&
                    (app.status === APP_STATUS_APPROVED ||
                        app.status === APP_STATUS_REJECTED) && (
                        <Link
                            to={`/user/app/${app.id}/version/new`}
                            tabIndex="-1"
                        >
                            <Button small>Upload new version</Button>
                        </Link>
                    )}
                {onApprove && (
                    <Button small onClick={onApprove}>
                        Approve
                    </Button>
                )}
                {onReject && (
                    <Button small onClick={onReject}>
                        Reject
                    </Button>
                )}
                {onDelete && (
                    <Button small destructive onClick={onDelete}>
                        Delete
                    </Button>
                )}
            </div>
        </div>
    )
}

AppCard.propTypes = {
    app: PropTypes.object.isRequired,
    showUploadButton: PropTypes.bool,
    onApprove: PropTypes.func,
    onDelete: PropTypes.func,
    onReject: PropTypes.func,
}

export default AppCard
