import { Tag } from '@dhis2/ui'

const PluginTag = ({ hasPlugin, pluginType }) => {
    if (!hasPlugin) {
        return null
    }
    const tagString = pluginType ? `Plugin: ${pluginType}` : 'Plugin'

    return <Tag neutral>{tagString}</Tag>
}

export default PluginTag
