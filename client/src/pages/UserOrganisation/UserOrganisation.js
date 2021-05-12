import {
    CenteredContent,
    NoticeBox,
    CircularLoader,
    Card,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import EditNameModal from './Modals/EditNameModal'
import InviteMemberModal from './Modals/InviteMemberModal'
import OrganisationUser from './OrganisationUser/OrganisationUser'
import styles from './UserOrganisation.module.css'
import { useQuery } from 'src/api'
import * as api from 'src/api'
import { relativeTimeFormat } from 'src/lib/relative-time-format'
import { useSuccessAlert, useErrorAlert } from 'src/lib/use-alert'
import { useModalState } from 'src/lib/use-modal-state'

const requestOpts = {
    useAuth: true,
}

const UserOrganisation = ({ match, user }) => {
    const { organisationId } = match.params
    const { data: organisation, error, mutate } = useQuery(
        `organisations/${organisationId}`,
        null,
        requestOpts
    )
    const inviteMemberModal = useModalState()
    const editNameModal = useModalState()
    const successAlert = useSuccessAlert()
    const errorAlert = useErrorAlert()

    const handlePromote = async userId => {
        try {
            await api.editOrganisation(organisation.id, { owner: userId })
            mutate({
                ...organisation,
                owner: userId,
            })
            successAlert.show({
                message: 'Successfully promoted organisation member',
            })
        } catch (error) {
            errorAlert.show({ error })
        }
    }
    const handleRemove = async userId => {
        try {
            await api.removeOrganisationMember(organisation.id, userId)
            mutate({
                ...organisation,
                users: organisation.users.filter(ou => ou.id !== userId),
            })
            successAlert.show({
                message: 'Successfully removed organisation member',
            })
        } catch (error) {
            errorAlert.show({ error })
        }
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
            <div className={styles.header}>
                <div className={styles.flex}>
                    <h2 className={styles.organisationName}>
                        {organisation.name}
                    </h2>
                    {isOwner && (
                        <>
                            {editNameModal.isVisible && (
                                <EditNameModal
                                    organisation={organisation}
                                    mutate={mutate}
                                    onClose={editNameModal.hide}
                                />
                            )}
                            <Button
                                small
                                secondary
                                onClick={editNameModal.show}
                            >
                                Edit name
                            </Button>
                        </>
                    )}
                </div>
                <div className={styles.createdAt}>
                    Created{' '}
                    <span title={new Date(organisation.createdAt).toString()}>
                        {relativeTimeFormat(organisation.createdAt)}
                    </span>
                </div>
            </div>

            <NoticeBox className={styles.notice}>
                All members of an organisation are allowed to upload apps on
                behalf of the organisation. Members may add new members to the
                organisation. Only the owner of the organisation is allowed to
                rename it.
            </NoticeBox>

            <section>
                {inviteMemberModal.isVisible && (
                    <InviteMemberModal
                        organisation={organisation}
                        mutate={mutate}
                        onClose={inviteMemberModal.hide}
                    />
                )}
                <div>
                    <h3 className={styles.subheader}>Members</h3>
                    <Button small primary onClick={inviteMemberModal.show}>
                        Invite member
                    </Button>
                </div>
                {organisation.users.map(ou => (
                    <OrganisationUser
                        key={ou.id}
                        user={{
                            ...ou,
                            isOwner: ou.id === organisation.owner,
                        }}
                        onPromote={isOwner && (() => handlePromote(ou.id))}
                        onRemove={isOwner && (() => handleRemove(ou.id))}
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
