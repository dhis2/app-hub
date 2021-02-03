import PropTypes from 'prop-types'
import React, { useState, useMemo } from 'react'
import { ToolbarGroup } from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Popover from 'material-ui/Popover'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import debounce from 'lodash/debounce'
import SubHeader from '../header/SubHeader'

const styles = {
    subHeader: {
        marginBottom: 0,
    },
    popover: {
        width: '200px',
    },
    filterWrapper: {
        padding: '10px',
    },
}

const ToggleList = ({ toggles, selected, onChange }) =>
    Object.entries(toggles).map(([value, label]) => (
        <Toggle
            key={value}
            label={label}
            onToggle={(_, toggled) => {
                const newSelected = new Set(selected)
                if (toggled) {
                    newSelected.add(value)
                } else {
                    newSelected.delete(value)
                }
                onChange(newSelected)
            }}
            toggled={selected.has(value)}
        />
    ))

ToggleList.propTypes = {
    selected: PropTypes.object.isRequired,
    toggles: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
}

const SearchField = ({ onChange }) => {
    const debouncedOnChange = useMemo(() => debounce(onChange, 300), [onChange])
    const handleChange = (_, value) => {
        debouncedOnChange(value)
    }

    return <TextField hintText="Search" onChange={handleChange} />
}

SearchField.propTypes = {
    onChange: PropTypes.func.isRequired,
}

const Filters = ({
    channels,
    channelsFilter,
    onChannelsFilterChange,
    types,
    typesFilter,
    onTypesFilterChange,
    onQueryChange,
}) => {
    const [show, setShow] = useState(false)
    const [popoverAnchorEl, setPopoverAnchorEl] = useState(null)

    const handlePopoverToggle = ({ currentTarget }) => {
        setPopoverAnchorEl(currentTarget)
        setShow(!show)
    }

    return (
        <SubHeader style={styles.subHeader}>
            <ToolbarGroup>
                <SearchField onChange={onQueryChange} />
            </ToolbarGroup>
            <ToolbarGroup>
                <IconButton onClick={handlePopoverToggle}>
                    <FontIcon className="material-icons">filter_list</FontIcon>
                </IconButton>
                <Popover
                    open={show}
                    anchorEl={popoverAnchorEl}
                    style={styles.popover}
                    onRequestClose={() => setShow(false)}
                >
                    <div style={styles.filterWrapper}>
                        <h3>App type</h3>
                        <ToggleList
                            toggles={types}
                            selected={typesFilter}
                            onChange={onTypesFilterChange}
                        />
                    </div>
                    <div style={styles.filterWrapper}>
                        <h3>Channel</h3>
                        <ToggleList
                            toggles={channels}
                            selected={channelsFilter}
                            onChange={onChannelsFilterChange}
                        />
                    </div>
                </Popover>
            </ToolbarGroup>
        </SubHeader>
    )
}

Filters.propTypes = {
    channels: PropTypes.object.isRequired,
    channelsFilter: PropTypes.object.isRequired,
    types: PropTypes.object.isRequired,
    typesFilter: PropTypes.object.isRequired,
    onChannelsFilterChange: PropTypes.func.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onTypesFilterChange: PropTypes.object.isRequired,
}

export default Filters
