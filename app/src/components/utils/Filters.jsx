import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import {Field, reduxForm} from 'redux-form';


export const filterApp = (app, filter) => {
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
    console.log(filters)
    if (!filters) return true;
    const filterVal = filters.values;
    for (let key in filterVal) {
        console.log(key)
        if (filterVal.hasOwnProperty(key)) {
            if (key == app.appType && filterVal[key] === true) {
                return true
            }
        }

    }
    return filterVal.length < 1 ? true : false
    //  const ret = filters.reduce((match, filter) => app.appType && app.appType === filter, true);
    //  console.log(ret)
    //  return filters.reduce((match, filter) => app.appType && app.appType === filter, false)
}


export class TextFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: props.value || '',
        }
    }

    handleFilterChange(e) {
        const filter = e.target.value;
        this.setState({
            ...this.state,
            filter,
        })

        this.props.onFilterChange(filter);
    }

    render() {
        const {style, hintText, ... props} = this.props;

        return (<TextField style={style} hintText={hintText}
                           onChange={this.handleFilterChange.bind(this)}
                           value={this.state.filter}></TextField>)
    }

}

TextFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    hintText: PropTypes.string,
    value: PropTypes.any
}

const renderToggle = ({input, label, meta: {touched, error}, ...props}) => (
    <Toggle
        label={label}
        onToggle={(e, toggled) => input.onChange(toggled)}
        toggled={input.value ? true : false}
        {...input}
        {...props}
    />
)

class Selectfilter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {style, filters, onFilterChange, ... props} = this.props;
        const toggles = filters.map(filter => (
                <Field key={filter.value}
                       name={filter.value}
                       component={renderToggle}
                       label={filter.label}
                       elementStyle={style}/>
            )
        )
        return <div>
            {toggles}
        </div>
    }

}
Selectfilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    style: PropTypes.object,
    value: PropTypes.value,
    filters: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        toggled: PropTypes.bool,
        value: PropTypes.string,
    })),
}
//handle default with connect
export const SelectedFilterForm = reduxForm({
    form: 'filters',
    destroyOnUnmount: false
})(Selectfilter)

//Convert filter props to initialValues to reduxForm
const mapStateToProps = ((state, ownProps) => {
    const init = {}
    ownProps.filters.map((elem, i) => {
        return init[elem.value] = elem.toggled;
    })
    return {
        initialValues: init
    }
})
export const SelectFilter = connect(mapStateToProps)(SelectedFilterForm);