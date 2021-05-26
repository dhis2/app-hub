import {
    Input,
    Checkbox,
    Divider,
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import styles from './Filters.module.css'

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
    onChannelsFilterChange,
    types,
    typesFilter,
    onTypesFilterChange,
    dhisVersions,
    dhisVersionFilter,
    onDhisVersionFilterChange,
    query,
    onQueryChange,
}) => (
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
            <div className={styles.filterWrapper}>
                <h3 className={styles.filterName}>Release Channels</h3>
                <CheckboxList
                    checkboxes={channels}
                    selected={channelsFilter}
                    onChange={onChannelsFilterChange}
                />
            </div>
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
                    {dhisVersions.map(dhisVersion => (
                        <SingleSelectOption
                            key={dhisVersion}
                            label={dhisVersion}
                            value={dhisVersion}
                        />
                    ))}
                </SingleSelect>
            </div>
        </div>
    </>
)

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
    query: PropTypes.string,
}

export default Filters
