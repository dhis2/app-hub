import { Button } from '@dhis2/ui'
import { useHistory } from 'react-router-dom'
import { getFormattedChangeType } from '../../utils/changelog'
import styles from './LatestUpdates.module.css'

export const LatestUpdates = ({ changelog }) => {
    const history = useHistory()
    if (!changelog) {
        return null
    }
    return (
        <div className={styles.latestUpdatesWrapper}>
            <div className={styles.latestUpdates}>
                <h2 className={styles.latestUpdatesHeader}>Latest updates:</h2>

                {changelog?.slice(0, 3).map((version, i) => {
                    return (
                        <div key={version.version}>
                            <h3 className={styles.latestUpdatesVersionHeading}>
                                {version.version}
                            </h3>
                            {version.changeSummary.map((change) => {
                                return (
                                    // todo: find a better key than i
                                    <div key={i}>
                                        {getFormattedChangeType(change)}
                                        {change.isTranslation ? (
                                            <span
                                                className={styles.translation}
                                            >
                                                Translations sync
                                            </span>
                                        ) : (
                                            change.text
                                        )}
                                        {change.link ? (
                                            <>
                                                {' '}
                                                (
                                                <a
                                                    className={styles.link}
                                                    rel="noreferrer"
                                                    target="_blank"
                                                    href={change.link}
                                                >
                                                    {'link'}
                                                </a>
                                                )
                                            </>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <div className={styles.showAllLink}>
                <span
                    role="link"
                    onClick={() => history.push('?tab=previous-releases')}
                >
                    Show all updates
                </span>
            </div>
        </div>
    )
}
