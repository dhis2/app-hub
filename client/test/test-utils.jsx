import { render as originalRender } from '@testing-library/react'
import { Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { history } from '../src/utils/history'

export const renderWithRoute = (component, params = {}) => {
    return originalRender(
        <Router history={history}>
            <QueryParamProvider
                ReactRouterRoute={Route}
                stringifyOptions={{ skipEmptyString: true }}
            >
                {component}
            </QueryParamProvider>
        </Router>,
        params
    )
}
