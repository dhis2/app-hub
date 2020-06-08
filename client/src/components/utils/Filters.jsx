import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import { Field, reduxForm } from 'redux-form'
import {
    renderTextField,
    renderTextFieldWithClearButton,
    renderToggle,
} from '../form/ReduxFormUtils'

/**
 * Filters an app according to properties defined in valsToFilter.
 * @param app to filter
 * @param filter a string to check if any of the properties in app contains this.
 * @returns {boolean} true if any of the properties matches the filter.
 */
export const filterApp = (app, filterVal) => {
    if (!filterVal) return true
    const filter = filterVal.toLowerCase()
    const valsToFilter = ['name', 'appType', 'organisation']
    for (let i = 0; i < valsToFilter.length; i++) {
        const val = valsToFilter[i]
        const prop = app[val]
        if (prop) {
            if (prop.toLowerCase().includes(filter)) {
                return true
            }
        }
        const devProp = app.developer[val]
        if (devProp) {
            if (devProp.toLowerCase().includes(filter)) {
                return true
            }
        }
    }
    return false
}

/**
 *
 * @param app to filter.
 * @param filters an redux-form object containing filters to check for app.
 * Should be of shape {filters: values}. Values should be of shape {appType: bool}.
 * @returns {boolean} true if app has an apptype in filter, otherwise false.
 */
export const filterAppType = (app, filters) => {
    if (!filters) return true
    const filterVal = filters.values
    for (const key in filterVal) {
        if (filterVal.hasOwnProperty(key)) {
            if (key == app.appType && filterVal[key] === true) {
                return true
            }
        }
    }
    return filterVal.length < 1 ? true : false
}

export const filterAppStatus = (app, filters) => {
    if (!filters) return true
    const filterVal = filters.values
    for (const key in filterVal) {
        if (filterVal.hasOwnProperty(key)) {
            if (key == app.status && filterVal[key] === true) {
                return true
            }
        }
    }
    return filterVal.length < 1 ? true : false
}

export const filterAppChannel = (app, filters) => {
    if (!filters) return true

    const filterVal = filters.values
    let foundAnyVersionWithMatchingChannel = false

    for (const versionIndex in app.versions) {
        const channel = app.versions[versionIndex].channel
        for (const key in filterVal) {
            if (
                filterVal.hasOwnProperty(key) &&
                key === channel &&
                filterVal[key] === true
            ) {
                foundAnyVersionWithMatchingChannel = true
                break
            }
        }
        if (foundAnyVersionWithMatchingChannel) {
            break
        }
    }

    return foundAnyVersionWithMatchingChannel
}

class Textfilter extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { style, hintText, clearButton, ...props } = this.props

        return (
            <Field
                name={this.props.name || this.props.form}
                style={style}
                hintText={hintText}
                component={
                    clearButton
                        ? renderTextFieldWithClearButton
                        : renderTextField
                }
            />
        )
    }
}

Textfilter.propTypes = {
    style: PropTypes.object,
    hintText: PropTypes.string,
    form: PropTypes.string,
    clearButton: PropTypes.bool,
}

Textfilter.defaultProps = {
    form: 'searchFilter',
    clearButton: true,
    destroyOnUnmount: false,
    initialValues: {
        searchFilter: '',
        appSearchFilter: '',
        orgSearchFilter: '',
    },
}

export const TextFilter = reduxForm({
    ...Textfilter.defaultProps,
})(Textfilter)

/**
 * Renders a list of toggle buttons, with props.filters as base.
 *
 * A redux-form connected component. Connected to the store at state.<mountedReduxForm>.<props.form>
 *     Where mountedReduxForm is the value where redux-form is connected at app-start.
 *     And props.form is a prop to this component (default: filters).
 *     All values can be retrieved from redux with filterName: value.
 *     So a filter with name "APP_STANDARD" can be retrieved from the state with:
 *     state.form.filter.values['APP_STANDARD'].
 */
class Selectfilter extends Component {
    constructor(props) {
        super(props)
    }

    toggleAll(toggled) {
        //props.form holds the name of the form, where the values exists
        Object.keys(this.props.filterState[this.props.form].values).map(
            (key, i) => {
                this.props.change(key, toggled)
            }
        )
    }

    render() {
        const {
            style,
            elementStyle,
            labelStyle,
            filters,
            onFilterChange,
            destroyOnUnmount,
        } = this.props
        const toggles = filters.map(filter => (
            <Field
                key={filter.value}
                name={filter.value}
                component={renderToggle}
                label={filter.label}
                style={elementStyle}
                labelStyle={labelStyle}
                destroyOnUnmount={
                    typeof destroyOnUnmount !== 'undefined'
                        ? destroyOnUnmount
                        : true
                }
            />
        ))
        return (
            <div style={style}>
                {toggles}
                {this.props.renderAllToggle ? (
                    <Field
                        name="all"
                        component={renderToggle}
                        label={'All'}
                        onToggle={this.toggleAll.bind(this)}
                        labelStyle={labelStyle}
                        value={true}
                        style={elementStyle}
                    />
                ) : null}
            </div>
        )
    }
}
Selectfilter.propTypes = {
    //The redux-form to use for mounting the values of the filter.
    form: PropTypes.string.isRequired,
    //style of the root element
    style: PropTypes.object,
    //style of the filter input elements
    elementStyle: PropTypes.object,
    //style of the label of the input elements
    labelStyle: PropTypes.object,
    value: PropTypes.string,
    filters: PropTypes.arrayOf(
        PropTypes.shape({
            //Label to show next to the toggle
            label: PropTypes.string.isRequired,
            //default toggled?
            toggled: PropTypes.bool.isRequired,
            //The name of the filter-field. State will be fieldValue: toggled
            value: PropTypes.string.isRequired,
        })
    ),
    //Renders a component which toggles all buttons in this group.
    renderAllToggle: PropTypes.bool,
    destroyOnUnmount: PropTypes.bool,
}
Selectfilter.defaultProps = {
    form: 'filters',
    destroyOnUnmount: false,
}
//handle default with connect
export const SelectedFilterForm = reduxForm({
    ...Selectfilter.defaultProps,
})(Selectfilter)

//Convert filter props to initialValues to reduxForm
const mapStateToProps = (state, ownProps) => {
    const init = {}
    ownProps.filters.map((elem, i) => {
        return (init[elem.value] = elem.toggled)
    })
    if (ownProps.renderAllToggle) {
        //default toggle all
        init['all'] = true
    }
    return {
        initialValues: init,
        filterState: state.form,
    }
}

export const SelectFilter = connect(mapStateToProps, null)(SelectedFilterForm)
