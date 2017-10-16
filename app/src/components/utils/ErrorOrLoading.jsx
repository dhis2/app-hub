import PropTypes from 'prop-types';
import React from "react";
import { Error } from "./Error";
//import { Spinner } from './Loader';
import Spinner from "./Spinner";

export const ErrorOrLoading = props => {
    if (!props.error && !props.loading) {
        return null;
    }
    const error = <Error retry={props.retry} message={props.errorMessage} />;
    const loading = <Spinner size="large" />;
    return props.error ? error : loading;
};

ErrorOrLoading.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    errorMessage: PropTypes.string,
    errorObject: PropTypes.object,
    retry: PropTypes.func
};

export default ErrorOrLoading;
