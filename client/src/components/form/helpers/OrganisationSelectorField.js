import React, { Component } from 'react'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import MenuItem from 'material-ui/MenuItem'
import { connect } from 'react-redux'
import {
    getMe,
    loadAllOrganisations,
    openDialog,
} from '../../../actions/actionCreators'
import {
    getAuthorizedOrganisationsList,
    getOrganisationMeta,
} from '../../../selectors/organisationSelectors'
import * as dialogTypes from '../../../constants/dialogTypes'
import { renderSelectField } from '../ReduxFormUtils'

const SelectFieldRF = renderSelectField

const styles = {
    fieldWrapper: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
    },
}

class OrganisationSelectorField extends Component {
    componentDidMount() {
        // reload /me to get up to date orgs
        this.props.getMe()
        this.props.loadAllOrganisations()
    }

    render() {
        const { input, label, organisations, requestMeta, ...rest } = this.props

        return (
            <div>
                <div style={styles.fieldWrapper}>
                    <SelectFieldRF
                        fullWidth
                        maxHeight={250}
                        label={label}
                        loading={requestMeta.loading}
                        hintText={
                            organisations.length > 0
                                ? 'Select an organisation'
                                : 'You are not a member of any organisation, create a new one.'
                        }
                        {...rest}
                        input={input}
                    >
                        {organisations.map(org => (
                            <MenuItem
                                key={org.id}
                                value={org.name}
                                primaryText={org.name}
                            />
                        ))}
                    </SelectFieldRF>
                    <IconButton onClick={this.props.openNewOrganisationDialog}>
                        <FontIcon className="material-icons">add</FontIcon>
                    </IconButton>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    orgs: 'test',
    organisations: getAuthorizedOrganisationsList(state),
    requestMeta: getOrganisationMeta(state),
})

const mapDispatchToProps = dispatch => ({
    getMe() {
        dispatch(getMe())
    },
    loadAllOrganisations() {
        dispatch(loadAllOrganisations())
    },
    openNewOrganisationDialog() {
        dispatch(openDialog(dialogTypes.NEW_ORGANISATION_DIALOG))
    },
})
const ConnectedOrganisationField = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganisationSelectorField)

export default ConnectedOrganisationField
