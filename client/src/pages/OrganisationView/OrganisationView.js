import { Card, CenteredContent, CircularLoader } from '@dhis2/ui'
import styles from './OrganisationView.module.css'
import { useQuery } from '../../api'
import AppCards from '../Apps/AppCards/AppCards'
import { relativeTimeFormat } from 'src/lib/relative-time-format'

const OrganisationView = ({ match }) => {
    const { organisationSlug } = match.params

    const { data: organisation } = useQuery(
        `organisations/${organisationSlug}?includeApps=true&includeUsers=false`
    )

    if (!organisation) {
        return (
            <CenteredContent>
                <CircularLoader large />
            </CenteredContent>
        )
    }
    return (
        <div>
            <Card className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.flex}>
                        <h2 className={styles.organisationName}>
                            {organisation?.name}
                        </h2>
                    </div>
                    <div className={styles.createdAt}>
                        <span>{organisation?.apps?.length} apps</span>
                        <span> | </span>
                        <span>
                            profile created{' '}
                            {relativeTimeFormat(
                                organisation?.createdAt ?? Date.now()
                            )}
                        </span>
                    </div>
                    {organisation?.description && (
                        <div className={styles.description}>
                            {organisation.description}
                        </div>
                    )}
                </div>

                <AppCards apps={organisation?.apps || []} />
            </Card>
        </div>
    )
}

export default OrganisationView
