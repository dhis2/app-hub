import React, { Component } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import { connect } from 'react-redux'
import { searchOrganisation, getMe } from '../../../actions/actionCreators'
import { isAsyncValidating } from 'redux-form'
import Theme from '../../../styles/theme'

const floatingLabelStyle = {
    color: Theme.palette.textHeaderColor,
}

class OrganisationSearchField extends Component {
    constructor(props) {
        super(props)

        // This is used to get the "open"-state of the autocomplete,
        // so that we are not showing the "new org"-message.
        // This is needed since the field is loosing focus when autocomplete-menu is open.
        this.state = {
            open: false, // tries to keep in sync with open autocomplete-menu, used to show message
        }
    }

    componentDidMount() {
        // reload /me to get up to date orgs
        this.props.getMe()
    }

    renderIsNewOrgMessage = () => {
        const { organisations } = this.props
        const { touched, valid, active } = this.props.meta
        const { value } = this.props.input

        if (
            value &&
            touched &&
            valid &&
            !active &&
            !this.state.open &&
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
        this.setState({ open: true })
    }

    render() {
        const {
            input,
            label,
            hintText,
            forceShowErrors,
            meta: { touched, error },
            organisations,
        } = this.props
        const orgs = organisations.map(org => org.name)
        return (
            <div>
                <AutoComplete
                    openOnFocus
                    floatingLabelFixed
                    floatingLabelText={label}
                    floatingLabelStyle={floatingLabelStyle}
                    ref={this.setAutoCompleteInputRef}
                    hintText={hintText || label}
                    dataSource={orgs}
                    onUpdateInput={this.handleOnChange}
                    onNewRequest={this.handleOnChange}
                    onClose={() => {
                        console.log('close!')
                        this.setState({ open: false })
                    }}
                    filter={(searchText, key) =>
                        searchText !== '' &&
                        key.toLowerCase().indexOf(searchText.toLowerCase()) !==
                            -1
                    }
                    errorText={(touched || forceShowErrors) && error}
                    searchText={input.value}
                    onBlur={(...args) =>
                        this.props.onBlur(...args) && this.forceUpdate()
                    }
                    open={true}
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
