import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { List } from 'material-ui/List'
import { Card, CardText } from 'material-ui/Card'
import OrganisationListItem from './OrganisationListItem'
import { TextFilter } from '../../utils/Filters'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import SubHeader from '../../header/SubHeader'
import {
    loadCurrentUserOrganisations,
    loadAllOrganisations,
} from '../../../actions/actionCreators'
import sortBy from 'lodash/sortBy'
import ErrorOrLoading from '../../utils/ErrorOrLoading'
import * as selectors from '../../../selectors/userSelectors'

class OrganisationList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }
    }

    componentDidMount() {
        const userInfo = this.props.user
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

    openDeleteDialog(app) {
        this.props.openDeleteDialog({ app })
    }

    render() {
        const {
            loading,
            loaded,
            error,
            byId: organisationList,
        } = this.props.organisationList
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
            <div>
                <SubHeader title={title}>
                    <TextFilter hintText="Search" name={'orgSearchFilter'} />
                    <IconButton onClick={this.handleOpenFilters.bind(this)}>
                        <FontIcon className="material-icons">
                            filter_list
                        </FontIcon>
                    </IconButton>
                </SubHeader>
                <Card>
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
            </div>
        )
    }
}

const mapStateToProps = state => ({
    organisationList: state.organisations,
    user: selectors.getUserInfo(state),
    searchFilter: state.form.searchFilter,
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        { loadAllOrganisations, loadCurrentUserOrganisations },
        dispatch
    )

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationList)
