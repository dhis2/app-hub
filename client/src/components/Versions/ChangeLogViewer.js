import {
    CircularLoader,
    Table,
    TableCell,
    TableRow,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Changelog from '../../utils/changelog'
import styles from './ChangeLogViewer.module.css'
import { useQuery } from 'src/api'

const ChangeLogViewer = ({ appId, latestVersion }) => {
    const { data, loading } = useQuery(`apps/${appId}/changelog`)

    const changelog = new Changelog(data?.changelog)

    const allVersions = changelog?.data?.map(({ version }) => version)
    const changesCount = allVersions?.length

    const [baseVersion, setBaseVersion] = useState(latestVersion)

    const [compareVersion, setCompareVersion] = useState()

    const firstVersionToShow = changelog.data.findIndex(
        (change) => change.version === baseVersion
    )

    const versionToCompareWith =
        compareVersion ??
        changelog.data[
            firstVersionToShow + 5 < changesCount
                ? firstVersionToShow + 5
                : changesCount - 2
        ]?.version

    const secondVersionToShow = changelog.data.findIndex(
        (change) => change.version === versionToCompareWith
    )

    const changesToShow = changelog.data.slice(
        firstVersionToShow,
        secondVersionToShow + 1
    )

    const availableVersionsToCompareWith = allVersions.slice(
        firstVersionToShow + 1
    )

    const getFormattedChangeType = ({ type, isTranslation }) => {
        if (isTranslation) {
            return null
        }
        if (type === 'Bug Fixes') {
            return 'Fix: '
        }
        if (type == 'Features') {
            return 'Feature: '
        }
        return type + ': '
    }

    if (!data || loading || !baseVersion) {
        return <CircularLoader large />
    }

    if (!data.changelog) {
        return (
            <div className={styles.container}>
                <div className={styles.disabledText}>
                    No change log available for this app.
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>Show changes included from: </div>
                <div className={styles.headerTitle}>
                    <SingleSelectField
                        dataTest="select-baseversion"
                        onChange={({ selected }) => setBaseVersion(selected)}
                        selected={baseVersion}
                        dense
                    >
                        {allVersions.map((version) => {
                            return (
                                <SingleSelectOption
                                    key={version}
                                    label={version}
                                    value={version}
                                />
                            )
                        })}
                    </SingleSelectField>
                </div>
                <div>to</div>
                <SingleSelectField
                    dataTest="select-compareversion"
                    onChange={({ selected }) => setCompareVersion(selected)}
                    selected={versionToCompareWith}
                    dense
                >
                    {availableVersionsToCompareWith.map((version) => {
                        return (
                            <SingleSelectOption
                                key={version}
                                label={version}
                                value={version}
                            />
                        )
                    })}
                </SingleSelectField>
            </div>
            <div className={styles.changelogContainer}>
                <Table suppressZebraStriping>
                    {changesToShow.map((entry) => {
                        const { version } = entry

                        return (
                            <TableRow
                                key={version}
                                className={classnames({
                                    [styles.breaking]: entry.isBreaking,
                                })}
                            >
                                <TableCell className={styles.versionHeader}>
                                    Version {version}
                                </TableCell>
                                <TableCell>
                                    <ul className={styles.list}>
                                        {entry.changeSummary.map(
                                            (change, i) => {
                                                return (
                                                    // todo: find a better key than i
                                                    <li key={i}>
                                                        <strong>
                                                            {getFormattedChangeType(
                                                                change
                                                            )}
                                                        </strong>
                                                        {change.isTranslation ? (
                                                            <span
                                                                className={
                                                                    styles.translation
                                                                }
                                                            >
                                                                Translations
                                                                sync
                                                            </span>
                                                        ) : (
                                                            change.text
                                                        )}
                                                        {change.link ? (
                                                            <>
                                                                {' | '}
                                                                <a
                                                                    className={
                                                                        styles.changeLink
                                                                    }
                                                                    rel="noreferrer"
                                                                    target="_blank"
                                                                    href={
                                                                        change.link
                                                                    }
                                                                >
                                                                    link
                                                                </a>
                                                            </>
                                                        ) : null}
                                                    </li>
                                                )
                                            }
                                        )}
                                    </ul>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </Table>
            </div>
        </div>
    )
}

ChangeLogViewer.propTypes = {
    appId: PropTypes.string,
    latestVersion: PropTypes.string,
}
export default ChangeLogViewer
