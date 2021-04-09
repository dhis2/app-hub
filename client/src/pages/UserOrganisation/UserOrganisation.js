import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Card,
    Tag,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './UserOrganisation.module.css'
import { useQuery } from 'src/api'
import { relativeTimeFormat } from 'src/lib/relative-time-format'

const OrganisationUser = ({ user, onPromote, onRemove }) => (
    <div className={styles.user}>
        <div>
            <div className={styles.userHeader}>
                <h4 className={styles.userName}>{user.name}</h4>
                {user.isOwner && <Tag neutral>Owner</Tag>}
            </div>
            <span className={styles.userEmail}>{user.email}</span>
        </div>
        <div>
            {!user.isOwner && onPromote && (
                <Button small secondary onClick={onPromote}>
                    Promote to owner
                </Button>
            )}
            {onRemove && (
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

const requestOpts = {
    useAuth: true,
}

const UserOrganisation = ({ match, user }) => {
    const { slug } = match.params
    const { data: organisation, error } = useQuery(
        `organisations/${slug}`,
        null,
        requestOpts
    )

    const handlePromote = (user) => {
        //
    }
    const handleRemove = (user) => {
        //
    }

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your organisations" error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!organisation) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    const isOwner = user.isManager || user.id === organisation.owner

    return (
        <Card className={styles.card}>
            {/* TODO: if user is owner, add 'edit name' button */}
            <div className={styles.header}>
                <h2 className={styles.organisationName}>{organisation.name}</h2>
                <div className={styles.createdAt}>
                    Created {relativeTimeFormat(organisation.createdAt)}
                </div>
            </div>
            <NoticeBox>
                All members of an organisation are allowed to upload apps on
                behalf of the organisation. Members may add new members to the
                organisation. Only the owner of the organisation is allowed to
                rename it.
            </NoticeBox>
            <section>
                <h3 className={styles.subheader}>Members</h3>
                {organisation.users.map(ou => (
                    <OrganisationUser
                        key={ou.id}
                        user={{
                            ...ou,
                            isOwner: ou.id === organisation.owner,
                        }}
                        onPromote={isOwner && () => handlePromote(ou.id)}
                        onRemove={isOwner && () => handleRemove(ou.id)}
                    />
                ))}
            </section>
        </Card>
    )
}

UserOrganisation.propTypes = {
    match: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
}

export default UserOrganisation
