import Changelog from '../../utils/changelog'
import { useQuery } from 'src/api'

const useChangelog = ({ appId, hasChangelog }) => {
    const { data, error } = useQuery(
        !hasChangelog ? null : `apps/${appId}/changelog`
    )

    if (!data || error) {
        return []
    }

    const changelog = new Changelog(data?.changelog)

    return changelog
}

export default useChangelog
