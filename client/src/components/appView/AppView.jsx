import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardTitle, CardHeader } from 'material-ui/Card'
import ImageViewer from './ImageViewer'
import Subheader from '../header/SubHeader'
import Grid from '../../material/Grid/Grid'
import Col from '../../material/Grid/Col'
import VersionList from '../appVersion/VersionList'
import { loadApp } from '../../actions/actionCreators'
import config from '../../../config'
import AppLogo from './AppLogo'
import Theme from '../../styles/theme'

const styles = {
    appDescription: {
        marginTop: '35px',
        paddingBottom: '25px',
    },
}

class AppView extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.loadApp({ appId: this.props.match.params.appId })
    }

    render() {
        const app = this.props.app
        if (!this.props.app) {
            return null
        }

        const { description, images } = app

        const subtitle = (
            <div>
                Type: {config.ui.appTypeToDisplayName[app.appType]} <br />
                Organisation: {app.developer.organisation}{' '}
            </div>
        )

        const logo = images.filter(elem => elem.logo)[0]

        return (
            <Grid style={{ maxWidth: '900px' }}>
                <Col span={12} phone={4}>
                    <Subheader title="App overview" backLink="/" />
                    <Card>
                        <div data-test="app-card-header">
                            <CardHeader
                                title={app.name}
                                avatar={<AppLogo logo={logo} />}
                                subtitle={subtitle}
                                titleStyle={{ fontSize: '2em' }}
                            />
                        </div>
                        {app.images.length > 0 ? (
                            <CardText
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                            >
                                <ImageViewer
                                    images={app.images}
                                    showEmptyMessage={false}
                                />
                            </CardText>
                        ) : null}

                        <CardText
                            style={{
                                ...Theme.paddedCard,
                                ...styles.appDescription,
                            }}
                            className="multiline-content"
                        >
                            {description}
                        </CardText>
                    </Card>

                    <Card
                        style={{
                            ...Theme.paddedCard,
                            marginTop: '12px',
                            position: 'relative',
                        }}
                    >
                        <CardTitle title="Versions" />
                        <CardText>
                            <VersionList versionList={app.versions} app={app} />
                        </CardText>
                    </Card>
                </Col>
            </Grid>
        )
    }
}

AppView.propTypes = {
    loadApp: PropTypes.func.isRequired,
    app: PropTypes.object,
    match: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
    app: state.appsList.byId[ownProps.match.params.appId],
})

const mapDispatchToProps = dispatch => ({
    loadApp(appId) {
        dispatch(loadApp(appId))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(AppView)
