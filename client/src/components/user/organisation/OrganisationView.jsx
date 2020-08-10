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
import { loadOrganisation, openDialog } from '../../../actions/actionCreators'
import * as dialogTypes from '../../../constants/dialogTypes'
import OrganisationMemberList from './OrganisationMemberList'
import RaisedButton from 'material-ui/RaisedButton/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'

const styles = {
    rightIconButtonStyle: {
        position: 'absolute',
        top: 0,
        right: '4px',
    },
    paddedCard: {
        marginTop: '12px',
        position: 'relative',
    },
    floatingActionButton: {
        margin: 0,
        right: 10,
        top: '-26px',
        position: 'absolute',
    },
}
class OrganisationView extends Component {

    componentDidMount() {
        this.props.loadOrganisation(this.props.match.params.slug)
    }

    render() {
        const { organisation } = this.props
        if (!organisation || !organisation.users) return null
        
        const subtitle = (
            <div>
                Owner: {organisation.owner.name} <br />
            </div>
        )
        return (
            <div>
                <Subheader
                    title="Organisation overview"
                    backLink="/user/organisations"
                />
                <Card>
                    <CardHeader
                        title={organisation.name}
                        //subtitle={subtitle}
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
                    >
                        All members of an organisation is allowed to upload apps on behalf of the organisation. 
                        Members may add new members to the organisation. Only the owner of the organisation is allowed to rename it.
                    </CardText>
                </Card>
                <Card style={styles.paddedCard}>
                    <FloatingActionButton
                    style={styles.floatingActionButton}
                        mini={true}
                        title="Add Member"
                        onClick={() =>
                            this.props.openAddMemberDialog(
                                this.props.organisation
                            )
                        }
                    >
                        <FontIcon className="material-icons">add</FontIcon>
                    </FloatingActionButton>
                    <CardTitle title="Members" actAsExpander={false} />

                    <CardText
                        style={Theme.paddedCard}
                        className="multiline-content"
                    >
                        <OrganisationMemberList
                        organisation={organisation}
                            members={organisation.users}
                            owner={organisation.owner}
                        />
                    </CardText>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const slug = ownProps.match.params.slug
    const organisation = organisationSelectors.getOrganisationBySlug(
        state,
        slug
    )

    return {
        organisation,
        canEdit:
            organisation &&
            organisationSelectors.canEditOrganisation(state, organisation.id),
    }
}

const mapDispatchToProps = dispatch => ({
    openAddMemberDialog: organisation =>
        dispatch(
            openDialog(dialogTypes.ADD_ORGANISATION_MEMBER, { organisation })
        ),
    ...bindActionCreators({ loadOrganisation }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationView)
