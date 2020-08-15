import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List } from 'material-ui/List'
import { Card, CardText } from 'material-ui/Card'
import { TextFilter } from '../../utils/Filters'
import FontIcon from 'material-ui/FontIcon'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import SubHeader from '../../header/SubHeader'
import OrganisationListItem from './OrganisationListItem'
import {
    loadCurrentUserOrganisations,
    loadAllOrganisations,
    openDialog,
    getMe,
} from '../../../actions/actionCreators'
import sortBy from 'lodash/sortBy'
import ErrorOrLoading from '../../utils/ErrorOrLoading'
import * as userSelectors from '../../../selectors/userSelectors'
import * as organisationSelectors from '../../../selectors/organisationSelectors'
import * as dialogTypes from '../../../constants/dialogTypes'

const styles = {
    containerDiv: {
        position: 'relative',
    },
    card: {
        marginTop: '12px',
        position: 'relative',
        maxHeight: 750,
        overflow: 'auto',
    },
    floatingActionButton: {
        bottom: -20,
        right: 10,
        position: 'absolute',
    },
}

class OrganisationList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }
    }

    componentDidMount() {
        const userInfo = this.props.user
        this.props.getMe()
        if (userInfo && userInfo.loaded) {
            userInfo.profile.manager
                ? this.props.loadAllOrganisations()
                : this.props.loadCurrentUserOrganisations()
        }
    }

    handleOpenFilters(e) {
        this.setState({
            ...this.state,
            open: !this.state.open,
            anchorEl: e.currentTarget,
        })
    }

    render() {
        const { loading, loaded, error } = this.props.organisationState
        const organisationList = this.props.organisationList
        const loadOrErr = loading || error
        const {
            user: { manager },
            match,
            searchFilter,
        } = this.props
        const orgSearchFilter = searchFilter
            ? searchFilter.values.orgSearchFilter
            : ''

        const orgItems = sortBy(organisationList, ['name'])
            .filter(org =>
                !orgSearchFilter
                    ? true
                    : org.name
                          .toLowerCase()
                          .includes(orgSearchFilter.toLowerCase())
            )
            .map(org => (
                <OrganisationListItem
                    organisation={org}
                    key={org.id}
                    isManager={manager}
                    match={match}
                />
            ))

        const emptyOrgsText = manager
            ? "We couldn't find any organisations."
            : 'You are not a member of any organisations.'
        const title = 'Organisations'

        return (
            <div style={styles.containerDiv}>
                <SubHeader title={title}>
                    <TextFilter hintText="Search" name={'orgSearchFilter'} />
                </SubHeader>
                <Card style={styles.card}>
                    <CardText>
                        {loadOrErr ? (
                            <ErrorOrLoading loading={loading} error={error} />
                        ) : null}
                        <List>
                            {loaded && orgItems.length > 0 ? orgItems : null}
                            {loaded && orgItems.length < 1
                                ? emptyOrgsText
                                : null}
                        </List>
                    </CardText>
                </Card>
                <FloatingActionButton
                    style={styles.floatingActionButton}
                    mini={true}
                    title="Add new Organisation"
                    onClick={() => this.props.openNewOrganisationDialog()}
                >
                    <FontIcon className="material-icons">add</FontIcon>
                </FloatingActionButton>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const userInfo = userSelectors.getUserInfo(state)
    return {
        organisationList: organisationSelectors.getAuthorizedOrganisationsList(
            state
        ),
        organisationState: state.organisations,
        user: userInfo,
        searchFilter: state.form.searchFilter,
    }
}

const mapDispatchToProps = dispatch => ({
    openNewOrganisationDialog: () =>
        dispatch(openDialog(dialogTypes.NEW_ORGANISATION_DIALOG)),
    ...bindActionCreators(
        { loadAllOrganisations, loadCurrentUserOrganisations, getMe },
        dispatch
    ),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationList)
