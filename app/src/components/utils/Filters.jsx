import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {Field, reduxForm, change} from 'redux-form';
import {renderTextField} from '../form/ReduxFormUtils';

export const filterApp = (app, filter) => {
    console.log(filter)
    if (!filter) return true;
    const valsToFilter = ['name', 'appType', 'organisation'];
    let match = false;
    for (let i = 0; i < valsToFilter.length; i++) {
        const val = valsToFilter[i];
        const prop = app[val];
        if (prop) {
            if (prop.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }
        const devProp = app.developer[val];
        if (app.developer && devProp) {
            if (devProp.toLowerCase().includes(filter)) {
                match = true;
                break;
            }
        }
    }
    return match;
}

export const filterAppType = (app, filters) => {
    if (!filters) return true;
    const filterVal = filters.values;
    for (let key in filterVal) {
        if (filterVal.hasOwnProperty(key)) {
            if (key == app.appType && filterVal[key] === true) {
                return true
            }
        }

    }
    return filterVal.length < 1 ? true : false
}


class Textfilter extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {style, hintText, ... props} = this.props;

        return (<Field name={this.props.form} style={style} hintText={hintText}
                       component={renderTextField}
        ></Field>)
    }

}

Textfilter.propTypes = {
    style: PropTypes.object,
    hintText: PropTypes.string,
    form: PropTypes.string,
}

Textfilter.defaultProps = {
    form: 'searchFilter',
    initialValues: {'searchFilter': ''},
}

export const TextFilter = reduxForm({
    ...Textfilter.defaultProps,
    destroyOnUnmount: false
})(Textfilter)

const renderToggle = ({input, changedCB, label, meta: {touched, error}, ...props}) => (
    <Toggle
        label={label}
        onToggle={(e, toggled) => {
            input.onChange(toggled);
            changedCB ? changedCB(toggled) : () => {
                }
        }}
        toggled={input.value ? true : false}
        {...input}
        {...props}
    />
)

/**
 * A redx-form connected component. Connected to the store at state.<mountedReduxForm>.<props.form>
 *     Where mountedReduxForm is the value where redux-form is connected at app-start.
 *     And props.form is a prop to this component (default: filters).
 *     All values can be retrieved from redux with filterName: value.
 *     So a filter with name "APP_STANDARD" can be retrieved from the state with:
 *     state.form.filter.values['APP_STANDARD'].
 */
class Selectfilter extends Component {
    constructor(props) {
        super(props);
    }

    toggleAll(toggled) {
        //props.form holds the name of the form, where the values exists
        Object.keys(this.props.filterState[this.props.form].values).map((key, i) => {
            this.props.change(key, toggled)
        })
    }

    render() {
        const {style, elementStyle, labelStyle, filters, onFilterChange, ... props} = this.props;
        const toggles = filters.map(filter => (
                <Field key={filter.value}
                       name={filter.value}
                       component={renderToggle}
                       label={filter.label}
                       style={elementStyle}
                       labelStyle={labelStyle}/>
            )
        )
        return <div style={style}>
            {toggles}
            {this.props.renderAllToggle ? <Field
                    name="all"
                    component={renderToggle}
                    label={"All"}
                    changedCB={this.toggleAll.bind(this)}
                    labelStyle={labelStyle}
                    style={elementStyle}/> : null}

        </div>
    }

}
Selectfilter.propTypes = {
    style: PropTypes.object,
    elementStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    value: PropTypes.string,
    filters: PropTypes.arrayOf(PropTypes.shape({
        //Label to show next to the toggle
        label: PropTypes.string.isRequired,
        //default toggled?
        toggled: PropTypes.bool.isRequired,
        //The name of the filter-field. State will be fieldValue: toggled
        value: PropTypes.string.isRequired,
    })),
    //Renders a component which toggles all buttons in this group.
    renderAllToggle: PropTypes.bool,
}
Selectfilter.defaultProps = {
    form: 'filters',
}
//handle default with connect
export const SelectedFilterForm = reduxForm({
    ...Selectfilter.defaultProps,
    destroyOnUnmount: false
})(Selectfilter)

//Convert filter props to initialValues to reduxForm
const mapStateToProps = (state, ownProps) => {
    const init = {}
    ownProps.filters.map((elem, i) => {
        return init[elem.value] = elem.toggled;
    })
    if (ownProps.renderAllToggle) { //default toggle all
        init['all'] = true
    }
    return {
        initialValues: init,
        filterState: state.form
    }
}
const mapDispatchToProps = (dispatch) => ({
    changeField(form, field, value) {
        dispatch(change(form, field, value))
    }
})
export const SelectFilter = connect(mapStateToProps, mapDispatchToProps)(SelectedFilterForm);