import React, { Component } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import { connect } from 'react-redux'
import { searchOrganisation, getMe } from '../../../actions/actionCreators'
import { isAsyncValidating } from 'redux-form'
class OrganisationSearchField extends Component {
    constructor(props) {
        super(props)

        // This is used to get the "open"-state of the autocomplete,
        // so that we are not showing the "new org"-message.
        // This is needed since the field is loosing focus when autocomplete-menu is open.
        this.autoCompleteInput = null
    }

    componentDidMount() {
        // reload /me to get up to date orgs
        this.props.getMe()
    }

    renderIsNewOrgMessage = () => {
        const { organisations } = this.props
        const { touched, valid, active } = this.props.meta
        const { value } = this.props.input
        const isOpen = this.autoCompleteInput
            ? this.autoCompleteInput.state.open
            : false

        if (
            value &&
            touched &&
            valid &&
            !active &&
            (!isOpen || (isOpen && !active)) && // isOpen is not always updated onBlur, so we check for active as well
            !this.props.isAsyncValidating &&
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

    setAutoCompleteInputRef = element => {
        this.autoCompleteInput = element
    }

    render() {
        const {
            input,
            label,
            forceShowErrors,
            meta: { touched, error },
            organisations,
        } = this.props
        const orgs = organisations.map(org => org.name)
        return (
            <div>
                <AutoComplete
                    ref={this.setAutoCompleteInputRef}
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
    isAsyncValidating: isAsyncValidating('uploadAppForm')(state),
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

export default ConnectedSearchField
