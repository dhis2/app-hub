import { Card, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import sharedStyles from '../UserApp.module.css'
import styles from './VersionsCard.module.css'
import Versions from 'src/components/Versions/Versions'

const VersionsCard = ({ app }) => {
    const versions = app.versions.sort((a, b) => b.created - a.created)
    const renderEditVersionButton = version => (
        <Link
            className={styles.editVersionButton}
            to={`/user/app/${app.id}/version/${version.id}/edit`}
            tabIndex="-1"
        >
            <Button small secondary>
                Edit
            </Button>
        </Link>
    )

    return (
        <Card className={sharedStyles.card}>
            <h2 className={sharedStyles.cardHeader}>Versions</h2>
            <Versions
                versions={versions}
                renderEditVersionButton={renderEditVersionButton}
            />
            <Link
                className={styles.newVersionButton}
                to={`/user/app/${app.id}/version/new`}
                tabIndex="-1"
            >
                <Button primary>New version</Button>
            </Link>
        </Card>
    )
}

VersionsCard.propTypes = {
    app: PropTypes.object.isRequired,
}

export default VersionsCard
