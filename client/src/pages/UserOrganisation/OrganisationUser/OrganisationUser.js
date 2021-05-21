import { Button, Tag } from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './OrganisationUser.module.css'

const OrganisationUser = ({ user, onPromote, onRemove }) => (
    <div className={styles.container}>
        <div>
            <div className={styles.header}>
                <h4 className={styles.name}>{user.name}</h4>
                {user.isOwner && <Tag neutral>Owner</Tag>}
            </div>
            <span className={styles.email}>{user.email}</span>
        </div>
        <div>
            {!user.isOwner && onPromote && (
                <Button small secondary onClick={onPromote}>
                    Promote to owner
                </Button>
            )}
            {!user.isOwner && onRemove && (
                <Button
                    small
                    destructive
                    onClick={onRemove}
                    className={styles.removeButton}
                >
                    Remove
                </Button>
            )}
        </div>
    </div>
)

OrganisationUser.propTypes = {
    user: PropTypes.object.isRequired,
    onPromote: PropTypes.func,
    onRemove: PropTypes.func,
}

export default OrganisationUser
