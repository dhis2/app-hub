import { render } from '@testing-library/react'
import '../../../test/mocks/setup.js'
import { Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import { history } from '../../utils/history'
import Apps from './Apps.js'

describe('Apps list (Homepage)', () => {
    it('should render all app cards', async () => {
        const { findByText, getAllByTestId } = render(
            <Router history={history}>
                <QueryParamProvider
                    ReactRouterRoute={Route}
                    stringifyOptions={{ skipEmptyString: true }}
                >
                    <Apps />
                </QueryParamProvider>
            </Router>
        )

        await findByText('Analytics Info')
        expect(getAllByTestId('appcard').length).toEqual(24)
        expect(getAllByTestId('appcard-name').length).toEqual(24)
        expect(getAllByTestId('appcard-organisation').length).toEqual(24)

        expect(getAllByTestId('appcard-description').length).toEqual(24)
    })
})
