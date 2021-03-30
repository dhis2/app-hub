import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui-core'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useQueryV1 } from '../../api/api'

// import config from '../../../config'

const AppView = ({ match }) => {
    const { appId } = match.params
    const { data, error } = useQueryV1(`apps/${appId}`)

    if (error) {
        return (
            <NoticeBox title={'Error loading app'} error>
                {error}
            </NoticeBox>
        )
    }

    if (!data) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    console.log(data)
    // const backLink =
    // this.props.history.length > 1 ? this.props.history.goBack : '/'

    return null
}

AppView.propTypes = {
    match: PropTypes.object.isRequired,
}

export default AppView
