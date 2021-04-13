import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import ChannelCheckbox from '../ChannelCheckbox/ChannelCheckbox'
import styles from './Filters.module.css'
import config from 'config'

const { dhisVersions, appChannelToDisplayName } = config.ui

const Filters = ({
    versions,
    channelsFilter,
    setChannelsFilter,
    dhisVersionFilter,
    setDhisVersionFilter,
}) => {
    const hasChannel = channel => versions.some(v => v.channel === channel)

    return (
        <div className={styles.versionsFilters}>
            <h3 className={styles.subheader}>Channel</h3>
            {Object.keys(appChannelToDisplayName)
                .filter(hasChannel)
                .map(channel => (
                    <ChannelCheckbox
                        key={channel}
                        name={channel}
                        label={appChannelToDisplayName[channel]}
                        channelsFilter={channelsFilter}
                        setChannelsFilter={setChannelsFilter}
                    />
                ))}
            <div className={styles.dhisVersionSelect}>
                <SingleSelectField
                    dense
                    placeholder={'Select a version'}
                    label={'Compatible with DHIS2 version'}
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
    channelsFilter: PropTypes.object.isRequired,
    dhisVersionFilter: PropTypes.string.isRequired,
    setChannelsFilter: PropTypes.func.isRequired,
    setDhisVersionFilter: PropTypes.func.isRequired,
    versions: PropTypes.array.isRequired,
}

export default Filters
