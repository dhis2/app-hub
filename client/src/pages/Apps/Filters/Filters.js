import {
    Input,
    Checkbox,
    Divider,
    SingleSelect,
    SingleSelectOption,
    IconChevronDown16,
    IconChevronUp16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import { useState } from 'react'
import styles from './Filters.module.css'
import config from 'config'

const CheckboxList = ({ checkboxes, selected, onChange }) =>
    Object.entries(checkboxes).map(([value, label]) => (
        <Checkbox
            key={value}
            dense
            label={label}
            onChange={({ checked }) => {
                const newSelected = new Set(selected)
                if (checked) {
                    newSelected.add(value)
                } else {
                    newSelected.delete(value)
                }
                onChange(newSelected)
            }}
            checked={selected.has(value)}
            value={value}
        />
    ))

CheckboxList.propTypes = {
    checkboxes: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

const Filters = ({
    channels,
    channelsFilter,
    organisations,
    onChannelsFilterChange,
    types,
    typesFilter,
    onTypesFilterChange,
    dhisVersions,
    dhisVersionFilter,
    onDhisVersionFilterChange,
    query,
    onQueryChange,
}) => {
    const [moreShown, setMoreShown] = useState(false)
    const onShowMore = () => {
        setMoreShown(!moreShown)
    }

    const organisationsToShow = moreShown
        ? organisations
        : organisations?.slice(0, 10)
    return (
        <>
            <Input
                type="search"
                placeholder="Search for an app"
                dense
                value={query}
                onChange={({ value }) => onQueryChange(value)}
            />
            <div className={styles.dividerContainer}>
                <Divider />
            </div>
            <div className={styles.filters}>
                <div className={styles.filterWrapper}>
                    <h3 className={styles.filterName}>App Categories</h3>
                    <CheckboxList
                        checkboxes={types}
                        selected={typesFilter}
                        onChange={onTypesFilterChange}
                    />
                </div>
                {config.ui.feature.channels && (
                    <div className={styles.filterWrapper}>
                        <h3 className={styles.filterName}>Release Channels</h3>
                        <CheckboxList
                            checkboxes={channels}
                            selected={channelsFilter}
                            onChange={onChannelsFilterChange}
                        />
                    </div>
                )}
                <div className={styles.filterWrapper}>
                    <h3 className={styles.filterName}>DHIS2 Version</h3>
                    <SingleSelect
                        className={styles.dhisVersionSelect}
                        dense
                        placeholder="Select a version"
                        clearable
                        clearText="Clear"
                        selected={dhisVersionFilter}
                        onChange={({ selected }) =>
                            onDhisVersionFilterChange(selected)
                        }
                    >
                        {dhisVersions.map((dhisVersion) => (
                            <SingleSelectOption
                                key={dhisVersion}
                                label={dhisVersion}
                                value={dhisVersion}
                            />
                        ))}
                    </SingleSelect>
                </div>
                {organisations && (
                    <div className={styles.filterWrapper}>
                        <h3 className={styles.filterName}>Organisations</h3>
                        {organisationsToShow.map(
                            ({
                                organisation_slug,
                                organisation,
                                app_count,
                            }) => (
                                <div
                                    className={styles.organisationLinkWrapper}
                                    key={organisation_slug}
                                >
                                    <a
                                        className={styles.organisationLink}
                                        href={`/organisation/${organisation_slug}/view`}
                                        value={organisation_slug}
                                    >
                                        <span>{organisation}</span>
                                    </a>{' '}
                                    <span
                                        className={styles.organisationAppCount}
                                    >
                                        ({app_count})
                                    </span>
                                </div>
                            )
                        )}
                        <div
                            className={styles.showMoreLink}
                            onClick={onShowMore}
                        >
                            {!moreShown ? (
                                <>
                                    <IconChevronDown16 />
                                    Show more
                                </>
                            ) : (
                                <>
                                    <IconChevronUp16 />
                                    Show less
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

Filters.propTypes = {
    channels: PropTypes.object.isRequired,
    channelsFilter: PropTypes.object.isRequired,
    dhisVersions: PropTypes.array.isRequired,
    types: PropTypes.object.isRequired,
    typesFilter: PropTypes.object.isRequired,
    onChannelsFilterChange: PropTypes.func.isRequired,
    onDhisVersionFilterChange: PropTypes.func.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onTypesFilterChange: PropTypes.func.isRequired,
    dhisVersionFilter: PropTypes.string,
    organisations: PropTypes.arrayOf(
        PropTypes.shape({
            app_count: PropTypes.string,
            organisation: PropTypes.string,
            organisation_slug: PropTypes.string,
        })
    ),
    query: PropTypes.string,
}

export default Filters
