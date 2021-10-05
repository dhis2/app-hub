import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
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
}) => {
    return (
        <div className={styles.versionsFilters}>
            {availableChannels.length > 1 && (
                <div className={styles.channelsFilter}>
                    <h3 className={styles.subheader}>Channel</h3>
                    {availableChannels.map(channel => (
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
            <div className={styles.dhisVersionSelect}>
                <SingleSelectField
                    dense
                    placeholder="Select a version"
                    label="Compatible with DHIS2 version"
                    clearable
                    selected={dhisVersionFilter}
                    onChange={({ selected }) => setDhisVersionFilter(selected)}
                >
                    {dhisVersions.map(dhisVersion => (
                        <SingleSelectOption
                            key={dhisVersion}
                            label={dhisVersion}
                            value={dhisVersion}
                        />
                    ))}
                </SingleSelectField>
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
}

export default Filters
