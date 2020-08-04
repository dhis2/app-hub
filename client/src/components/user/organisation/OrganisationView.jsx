import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FontIcon from 'material-ui/FontIcon'
import LogoAvatar from '../../appView/AppLogo'
import IconButton from 'material-ui/IconButton'
import Subheader from '../../header/SubHeader'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import { Card, CardText, CardTitle, CardHeader } from 'material-ui/Card'
import Theme from '../../../styles/theme'
import ErrorOrLoading from '../../utils/ErrorOrLoading'
import * as userSelectors from '../../../selectors/userSelectors'
import * as organisationSelectors from '../../../selectors/organisationSelectors'
import { loadOrganisation } from '../../../actions/actionCreators'

const styles = {
    rightIconButtonStyle: {
        position: 'absolute',
        top: 0,
        right: '4px',
    },
    paddedCard: {
        marginTop: '12px',
       // position: 'relative'
    }
}
class OrganisationView extends Component {
    componentDidMount() {
        this.props.loadOrganisation(this.props.match.params.slug)
    }

    render() {
        const { organisation } = this.props
        if(!organisation) return null

        const subtitle = (
            <div>
                Owner: {organisation.owner.name} <br />
            </div>
        )
        return (
            <div>
                <Subheader title="Organisation overview" backLink="/user" />
                <Card>
                    <CardHeader
                        title={organisation.name}
                        subtitle={subtitle}
                        titleStyle={{ fontSize: '2em' }}
                    >
                        <IconButton
                            style={styles.rightIconButtonStyle}
                            //onClick={onOpenEditApp}
                        >
                            <i className="material-icons">edit</i>
                        </IconButton>
                    </CardHeader>

                    <CardText
                        style={Theme.paddedCard}
                        className="multiline-content"
                    ><h3>Members</h3></CardText>
                </Card>
                <Card style={styles.paddedCard}>
                <CardTitle title="Members" actAsExpander={false} />

                    <CardText
                        style={Theme.paddedCard}
                        className="multiline-content"
                    ><h3>Members</h3></CardText>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const slug = ownProps.match.params.slug
    const userInfo = userSelectors.getUserInfo(state)
    return {
        organisation: organisationSelectors.getOrganisationBySlug(state, slug),
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators({ loadOrganisation }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationView)
