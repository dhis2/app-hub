import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import DetailsCard from './DetailsCard/DetailsCard'
import ScreenshotsCard from './ScreenshotsCard/ScreenshotsCard'
import VersionsCard from './VersionsCard/VersionsCard'
import { useQueryV1 } from 'src/api'

const UserApp = ({ match }) => {
    const { appId } = match.params
    const { data: app, error, mutate } = useQueryV1(`apps/${appId}`, {
        auth: true,
    })

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox title="Error loading your app" error>
                    {error.message}
                </NoticeBox>
            </CenteredContent>
        )
    }

    if (!app) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <>
            <DetailsCard app={app} mutate={mutate} />
            <VersionsCard app={app} mutate={mutate} />
            <ScreenshotsCard app={app} mutate={mutate} />
        </>
    )
}

UserApp.propTypes = {
    match: PropTypes.object.isRequired,
}

export default UserApp
