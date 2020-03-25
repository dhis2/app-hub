import React, { Component } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import { connect } from 'react-redux'
import { searchOrganisation, getMe } from '../../../actions/actionCreators'
import debounce from 'lodash/debounce'

class OrganisationSearchField extends Component {
    constructor(props) {
        super(props)

        this.state = {
            organisationMember: {},
        }
    }

    componentDidMount() {
        // reload /me to get up to date orgs
        this.props.getMe()
    }

    renderIsNewOrgMessage = () => {
        const { organisations } = this.props
        const { touched, visited, valid, active } = this.props.meta
        const { value } = this.props.input

        if (
            value &&
            touched &&
            valid &&
            !active &&
            !organisations.find(
                org => org.name.toLowerCase() === value.toLowerCase()
            )
        ) {
            return (
                <p>
                    The organisation does not exist. It will be created
                    automatically and you will be the owner.
                </p>
            )
        }

        return null
    }

    handleOnChange = val => {
        if (val !== this.props.input.value) {
            this.props.searchOrganisation(val)
            this.props.input.onChange(val)
        }
    }

    render() {
        const {
            input,
            label,
            forceShowErrors,
            meta: { touched, error, warning },
            children,
            organisations,
            ...props
        } = this.props

        const orgs = organisations.map(org => org.name)
        console.log(error)
        return (
            <div>
                <AutoComplete
                    hintText={label}
                    dataSource={orgs}
                    onUpdateInput={this.handleOnChange}
                    onNewRequest={this.handleOnChange}
                    filter={(searchText, key) =>
                        searchText !== '' &&
                        key.toLowerCase().indexOf(searchText.toLowerCase()) !==
                            -1
                    }
                    errorText={(touched || forceShowErrors) && error}
                    searchText={input.value}
                    {...input}
                ></AutoComplete>
                {this.renderIsNewOrgMessage()}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    memberOfOrgs: state.user.organisations,
})

const mapDispatchToProps = dispatch => ({
    searchOrganisation(name) {
        dispatch(searchOrganisation({ name }))
    },
    getMe() {
        dispatch(getMe())
    },
})
const ConnectedSearchField = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganisationSearchField)

const renderFormField = ({
    input,
    label,
    meta: { tocuhed, error, dirty },
    children,
    ...props
}) => {
    return <OrganisationSearchField></OrganisationSearchField>
}

export default ConnectedSearchField
