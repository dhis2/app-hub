// eslint-disable-next-line react/no-deprecated
import PropTypes from 'prop-types'
import React from 'react'
import { Error } from './Error'
//import { Spinner } from './Loader';
import Spinner from './Spinner'

export const ErrorOrLoading = props => {
    const loading = <Spinner size="large" />
    return loading
    if (!props.error && !props.loading) {
        return null
    }
    const error = <Error retry={props.retry} message={props.errorMessage} />

    return props.error ? error : loading
}

ErrorOrLoading.propTypes = {
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    loading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    errorObject: PropTypes.object,
    retry: PropTypes.func,
}

export default ErrorOrLoading
