import {
    Button,
    IconClockHistory16,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import ChannelCheckbox from '../ChannelCheckbox/ChannelCheckbox'
import styles from './Filters.module.css'
import config from 'config'

const { dhisVersions, appChannelToDisplayName } = config.ui

const Filters = ({
    availableChannels,
    channelsFilter,
    setChannelsFilter,
    dhisVersionFilter,
    setDhisVersionFilter,
    showChangeLog,
    hasChangelog,
}) => {
    return (
        <div className={styles.versionsFilters}>
            {availableChannels.length > 1 && (
                <div className={styles.channelsFilter}>
                    <h3 className={styles.subheader}>Channel</h3>
                    {availableChannels.map((channel) => (
                        <ChannelCheckbox
                            key={channel}
                            name={channel}
                            label={appChannelToDisplayName[channel]}
                            channelsFilter={channelsFilter}
                            setChannelsFilter={setChannelsFilter}
                        />
                    ))}
                </div>
            )}
            <div className={styles.filtersWrapper}>
                <div className={styles.dhisVersionsSelect}>
                    <SingleSelectField
                        dense
                        placeholder="Select a version"
                        prefix="DHIS2 compatibility"
                        clearable
                        selected={dhisVersionFilter}
                        onChange={({ selected }) => {
                            if (!selected) {
                                setDhisVersionFilter('-1')
                            } else {
                                setDhisVersionFilter(selected)
                            }
                        }}
                    >
                        <SingleSelectOption
                            key={-1}
                            label="All versions"
                            value="-1"
                        />
                        {dhisVersions.map((dhisVersion) => (
                            <SingleSelectOption
                                key={dhisVersion}
                                label={dhisVersion}
                                value={dhisVersion}
                            />
                        ))}
                    </SingleSelectField>
                </div>
                {hasChangelog && (
                    <div>
                        <Button
                            icon={<IconClockHistory16 />}
                            onClick={showChangeLog}
                        >
                            View version changes
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

Filters.propTypes = {
    availableChannels: PropTypes.arrayOf(PropTypes.string).isRequired,
    channelsFilter: PropTypes.object.isRequired,
    dhisVersionFilter: PropTypes.string.isRequired,
    setChannelsFilter: PropTypes.func.isRequired,
    setDhisVersionFilter: PropTypes.func.isRequired,
    hasChangelog: PropTypes.bool,
    showChangeLog: PropTypes.func,
}

export default Filters
