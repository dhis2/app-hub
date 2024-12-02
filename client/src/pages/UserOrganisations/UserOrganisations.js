import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Card,
    Tag,
    Button,
    Input,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styles from './UserOrganisations.module.css'
import { useQuery } from 'src/api'
import { relativeTimeFormat } from 'src/lib/relative-time-format'

const filterOrganisations = (organisations, query) => {
    if (!query) {
        return organisations
    }
    return organisations.filter((organisation) =>
        organisation.name.toLowerCase().includes(query.toLowerCase())
    )
}

const OrganisationCard = ({ organisation, isOwner }) => (
    <Link
        to={`/user/organisation/${organisation.id}`}
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
    const [query, setQuery] = useState('')
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

    const filteredOrganisations = filterOrganisations(organisations, query)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <Link to="/user/organisations/new" tabIndex="-1">
                        <Button primary>Create a new organisation</Button>
                    </Link>
                </div>
                <Input
                    className={styles.searchInput}
                    type="search"
                    placeholder="Search all your organisations"
                    value={query}
                    onChange={({ value }) => setQuery(value)}
                />
            </div>
            <Card className={styles.card}>
                <h2 className={styles.cardHeader}>Your organisations</h2>
                {organisations.length === 0 && (
                    <>
                        <em>You are not a member of any organisations.</em>
                        <div style={{ marginTop: 8 }}>
                            <Link to="/user/organisations/new" tabIndex="-1">
                                <Button large>
                                    Create your first organisation
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
                {organisations.length > 0 &&
                    filteredOrganisations.length === 0 && (
                        <em>
                            No organisations found. Try adjusting your search.
                        </em>
                    )}
                {filteredOrganisations.map((organisation) => (
                    <OrganisationCard
                        key={organisation.id}
                        organisation={organisation}
                        isOwner={user.id === organisation.owner}
                    />
                ))}
            </Card>
        </div>
    )
}

UserOrganisations.propTypes = {
    user: PropTypes.object.isRequired,
}

export default UserOrganisations
