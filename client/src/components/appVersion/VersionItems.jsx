import MenuItem from 'material-ui/MenuItem'
import React from 'react'
import config from '../../../config'

export const VersionMenuItems = config.ui.dhisVersions.map(version => (
    <MenuItem key={version} value={version} primaryText={version} />
))

export default VersionMenuItems
