import { useAuth0 } from '@auth0/auth0-react'
import { Button, Divider } from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useHistory, useLocation } from 'react-router-dom'
import styles from './VersionsTable.module.css'
import config from 'config'
import { renderDhisVersionsCompatibility } from 'src/lib/render-dhis-versions-compatibility'

const { appChannelToDisplayName } = config.ui

const useCreateGetDownloadUrl = (url) => {
    const [token, setToken] = useState()
    const { getAccessTokenSilently, isAuthenticated } = useAuth0()

    useEffect(() => {
        const getToken = async () => {
            if (isAuthenticated) {
                const token = await getAccessTokenSilently()
                setToken(token)
            }
        }
        getToken()
    }, [url, getAccessTokenSilently, isAuthenticated])

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
    userCanEditApp,
}) => {
    const getDownloadUrl = useCreateGetDownloadUrl()
    const history = useHistory()
    const location = useLocation()

    const ref = useRef(null)

    const setRef = useCallback(
        (node) => {
            // in the case of an anchor link to a specific version, make sure the apps list is loaded first
            if (node && location.hash) {
                document
                    .getElementById(location.hash?.replace('#', ''))
                    ?.scrollIntoView()
            }
            ref.current = node
        },
        [location.hash]
    )

    return (
        <ol className={styles.versionList} ref={setRef}>
            {versions.map((version) => {
                const changes = changelogData?.[version.version] ?? ''

                return (
                    <li data-test="version-list-item" key={version.version}>
                        <a href={`#${version.version}`}>
                            <h2
                                id={version.version}
                                className={styles.versionHeading}
                            >
                                {version.version}
                            </h2>
                        </a>

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

                            <div className={styles.actionsWrapper}>
                                <a
                                    className={styles.link}
                                    download
                                    href={getDownloadUrl(version.downloadUrl)}
                                    tabIndex="-1"
                                >
                                    Download
                                </a>
                                {userCanEditApp && (
                                    <Button
                                        small
                                        secondary
                                        onClick={() =>
                                            history.push(
                                                `/user/app/${version.appId}/version/${version.id}/edit`
                                            )
                                        }
                                    >
                                        Edit
                                    </Button>
                                )}
                                {renderDeleteVersionButton &&
                                    renderDeleteVersionButton(version)}
                            </div>
                        </div>

                        <div className={styles.changeSummary}>
                            {version.changeSummary ? (
                                <ReactMarkdown>
                                    {version.changeSummary}
                                </ReactMarkdown>
                            ) : null}
                            <ReactMarkdown>{changes}</ReactMarkdown>
                        </div>
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
