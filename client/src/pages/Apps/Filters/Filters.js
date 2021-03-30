import { Input, Checkbox, Divider } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
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
            disabled={selected.has(value) && selected.size == 1}
        />
    ))

CheckboxList.propTypes = {
    checkboxes: PropTypes.object.isRequired,
    selected: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

const SearchField = ({ initialValue, onChange }) => {
    const [value, setValue] = useState(initialValue)
    const debouncedOnChange = useCallback(debounce(onChange, 300), [onChange])
    const handleChange = ({ value }) => {
        setValue(value)
        debouncedOnChange(value)
    }
    return (
        <Input
            type="search"
            placeholder="Search for an app"
            dense
            onChange={handleChange}
            value={value}
        />
    )
}

SearchField.propTypes = {
    onChange: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
}

const Filters = ({
    channels,
    channelsFilter,
    onChannelsFilterChange,
    types,
    typesFilter,
    onTypesFilterChange,
    query,
    onQueryChange,
}) => (
    <>
        <SearchField initialValue={query} onChange={onQueryChange} />
        <div className={styles.dividerContainer}>
            <Divider />
        </div>
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
    </>
)

Filters.propTypes = {
    channels: PropTypes.object.isRequired,
    channelsFilter: PropTypes.object.isRequired,
    types: PropTypes.object.isRequired,
    typesFilter: PropTypes.object.isRequired,
    onChannelsFilterChange: PropTypes.func.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onTypesFilterChange: PropTypes.func.isRequired,
    query: PropTypes.string,
}

export default Filters
