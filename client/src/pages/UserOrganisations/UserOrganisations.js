import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Card,
    Tag,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import styles from './UserOrganisations.module.css'
import { useQuery } from 'src/api'
import { relativeTimeFormat } from 'src/lib/relative-time-format'

const OrganisationCard = ({ organisation, isOwner }) => (
    <Link
        to={`/user/organisations/${organisation.slug}`}
        className={styles.organisationLink}
    >
        <div className={styles.organisationHeader}>
            <h3 className={styles.organisationName}>{organisation.name}</h3>
            {isOwner && (
                <Tag neutral className={styles.organisationOwner}>
                    Owner
                </Tag>
            )}
        </div>
        <div className={styles.organisationCreatedAt}>
            Created {relativeTimeFormat(organisation.createdAt)}
        </div>
    </Link>
)

const requestOpts = {
    useAuth: true,
}

const UserOrganisations = ({ user }) => {
    const { data: organisations, error } = useQuery(
        'organisations',
        useMemo(
            () => ({
                user: user.isManager ? null : user.id,
            }),
            [user.isManager, user.id]
        ),
        requestOpts
    )

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your organisations" error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!organisations) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <Card className={styles.card}>
            <h2 className={styles.header}>Your organisations</h2>
            {organisations.map(organisation => (
                <OrganisationCard
                    key={organisation.id}
                    organisation={organisation}
                    isOwner={user.id === organisation.owner}
                />
            ))}
        </Card>
    )
}

UserOrganisations.propTypes = {
    user: PropTypes.object.isRequired,
}

export default UserOrganisations
