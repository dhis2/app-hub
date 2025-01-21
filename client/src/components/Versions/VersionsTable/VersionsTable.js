import { useAuth0 } from '@auth0/auth0-react'
import { Divider } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { getFormattedChangeType } from '../../../utils/changelog'
import styles from './VersionsTable.module.css'
import config from 'config'
import { renderDhisVersionsCompatibility } from 'src/lib/render-dhis-versions-compatibility'

const { appChannelToDisplayName } = config.ui

const useCreateGetDownloadUrl = (url) => {
    const [token, setToken] = useState()
    const { getAccessTokenSilently } = useAuth0()

    useEffect(() => {
        const getToken = async () => {
            const token = await getAccessTokenSilently()
            setToken(token)
        }
        getToken()
    }, [url, getAccessTokenSilently])

    return useCallback(
        (url) => (token ? url.concat(`?token=${token}`) : url),
        [token]
    )
}

const VersionsTable = ({
    versions,
    renderDeleteVersionButton,
    showDownloadCount,
    changelogData,
}) => {
    const getDownloadUrl = useCreateGetDownloadUrl()

    return (
        <ol className={styles.versionList}>
            {versions.map((version) => {
                const changes = changelogData?.[version.version] ?? []

                return (
                    <li data-test="version-list-item" key={version.version}>
                        <h2 className={styles.versionHeading}>
                            {version.version}
                        </h2>

                        <div className={styles.versionSubheading}>
                            <div>
                                {new Date(version.createdAt).toLocaleDateString(
                                    undefined,
                                    { dateStyle: 'long' }
                                )}
                            </div>
                            {showDownloadCount && (
                                <div>
                                    <span>{version.downloadCount}</span>{' '}
                                    downloads
                                </div>
                            )}
                            <div>
                                {appChannelToDisplayName[version.channel]}
                            </div>
                            <div>
                                DHIS2{' '}
                                {renderDhisVersionsCompatibility(
                                    version.minDhisVersion,
                                    version.maxDhisVersion
                                )}
                            </div>

                            <div>
                                <a
                                    className={styles.link}
                                    download
                                    href={getDownloadUrl(version.downloadUrl)}
                                    tabIndex="-1"
                                >
                                    Download
                                </a>
                                {renderDeleteVersionButton &&
                                    renderDeleteVersionButton(version)}
                            </div>
                        </div>

                        <ul className={styles.changesBullets}>
                            {changes?.map((change, i) => {
                                return (
                                    // todo: find a better key than i
                                    <li key={i}>
                                        <strong>
                                            {getFormattedChangeType(change)}
                                        </strong>
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
                                    </li>
                                )
                            })}
                        </ul>
                        <Divider className={styles.versionDivider} />
                    </li>
                )
            })}
        </ol>
    )
}
VersionsTable.propTypes = {
    versions: PropTypes.array.isRequired,
    renderDeleteVersionButton: PropTypes.func,
}

export default VersionsTable
