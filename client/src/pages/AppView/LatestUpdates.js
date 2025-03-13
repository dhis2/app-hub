import ReactMarkdown from 'react-markdown'
import { useHistory } from 'react-router-dom'
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

                <ol className={styles.versionList}>
                    {changelog?.slice(0, 3).map((version, i) => {
                        return (
                            <li key={version.version}>
                                <h3
                                    className={
                                        styles.latestUpdatesVersionHeading
                                    }
                                >
                                    {version.version}
                                </h3>
                                <div className={styles.changeSummary}>
                                    <ReactMarkdown>
                                        {version.rawChangeSummary}
                                    </ReactMarkdown>
                                </div>
                            </li>
                        )
                    })}
                </ol>
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
