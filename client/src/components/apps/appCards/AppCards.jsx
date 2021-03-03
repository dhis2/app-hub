import PropTypes from 'prop-types'
import React from 'react'
import Grid from '../../../material/Grid/Grid'
import Col from '../../../material/Grid/Col'
import Spinner from '../../utils/Spinner'
import Error from '../../utils/Error'
import AppCardItem from './AppCardItem'

const styles = {
    emptyApps: {
        margin: 'auto',
        marginTop: '2em',
        fontSize: '2em',
        textAlign: 'center',
    },
}

const AppCards = ({ isLoading, error, apps }) => {
    if (error) {
        return <Error size="large" message={error} />
    }

    if (isLoading) {
        return <Spinner size="large" />
    }

    if (apps.length == 0) {
        return (
            <p style={styles.emptyApps}>
                We couldn't find any apps that match your criteria.
            </p>
        )
    }

    return (
        <Grid>
            {apps.map(app => (
                <Col key={app.id} span={3} phone={4}>
                    <AppCardItem app={app} />
                </Col>
            ))}
        </Grid>
    )
}

AppCards.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    apps: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.string,
}

export default AppCards
