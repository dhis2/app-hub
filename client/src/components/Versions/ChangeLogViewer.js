import {
    CircularLoader,
    DataTable,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    Modal,
    ModalContent,
    ModalTitle,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import { useQuery } from 'src/api'

import React from 'react'
import Changelog from '../../utils/changelog'
import classnames from 'classnames'
import styles from './ChangeLogViewer.module.css'

const ChangeLogViewer = ({
    appId,
    onCloseChangelog,
    baseVersion,
    setBaseVersion,
    setCompareVersion,
    compareVersion,
}) => {
    const { data, loading } = useQuery(`apps/${appId}/changelog`)

    if (!data || loading) {
        return <CircularLoader large />
    }

    if (!data.changelog) {
        return null
    }

    const changelog = new Changelog(data.changelog)

    const allVersions = changelog.data.map(({ version }) => version)
    const changesCount = allVersions.length

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
        firstVersionToShow + 1,
        changelog.data?.length - firstVersionToShow
    )

    const getType = (type) => {
        if (type === 'Bug Fixes') {
            return 'Fix'
        }
        if (type == 'Features') {
            return 'Feature'
        }
        return type
    }
    return (
        <Modal onClose={onCloseChangelog}>
            <ModalTitle>
                <div className={styles.header}>
                    <div>Changes in</div>
                    <div className={styles.headerTitle}>
                        <SingleSelectField
                            onChange={({ selected }) =>
                                setBaseVersion(selected)
                            }
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
                    <SingleSelectField
                        prefix="compared to"
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
            </ModalTitle>
            <ModalContent>
                <div className={styles.cardContainer}>
                    <div className={styles.changelogContainer}>
                        <DataTable>
                            <DataTableHead>
                                <DataTableColumnHeader>
                                    Version
                                </DataTableColumnHeader>
                                <DataTableColumnHeader>
                                    Changes
                                </DataTableColumnHeader>
                            </DataTableHead>
                            {changesToShow.map((entry) => {
                                const { version } = entry

                                return (
                                    <DataTableRow
                                        key={version}
                                        className={classnames({
                                            [styles.breaking]: entry.isBreaking,
                                        })}
                                    >
                                        <DataTableCell
                                            className={styles.versionHeader}
                                        >
                                            {version}
                                        </DataTableCell>
                                        <DataTableCell>
                                            <ul className={styles.list}>
                                                {entry.changeSummary.map(
                                                    (change, i) => {
                                                        if (
                                                            change.isTranslation
                                                        ) {
                                                            return (
                                                                <li
                                                                    key={i} // ToDo: find a better key
                                                                    className={
                                                                        styles.translation
                                                                    }
                                                                >
                                                                    Translations
                                                                    update
                                                                </li>
                                                            )
                                                        }
                                                        return (
                                                            <li key={i}>
                                                                <strong>
                                                                    {getType(
                                                                        change.type
                                                                    )}
                                                                </strong>
                                                                : {change.text}
                                                                {change.link ? (
                                                                    <>
                                                                        {' | '}
                                                                        <a
                                                                            className={
                                                                                styles.changeLink
                                                                            }
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
                                        </DataTableCell>
                                    </DataTableRow>
                                )
                            })}
                        </DataTable>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    )
}

export default ChangeLogViewer
