import { render } from '@testing-library/react'
import AppView from './AppView.js'
import '../../../test/mocks/setup.js'

describe('AppView', () => {
    it('should render app details', async () => {
        const appId = '08c48425-abd3-410e-8802-8f9ada971c03'

        const { findByText, getByTestId } = render(
            <AppView
                match={{
                    params: { appId },
                }}
            />
        )

        await findByText('ADEx Flow')

        // check organisation link
        const organisationLink = getByTestId('organisation-link')
        expect(organisationLink).toHaveTextContent(
            'DHIS2 Global Implementation Team'
        )
        expect(organisationLink).toHaveAttribute(
            'href',
            '/organisation/dhis2-global-implementation-team/view'
        )

        expect(getByTestId('app-type')).toHaveTextContent('Application')

        // Check the buttons
        const downloadButton = getByTestId('button-download-latest-version')
        expect(downloadButton).toHaveTextContent('Download latest version')
        expect(downloadButton.getAttribute('href')).toMatch(
            'api/v1/apps/download/dhis2-global-implementation-team/adex-flow_0.1.5.zip'
        )

        // latest version description
        expect(getByTestId('latest-version-description')).toHaveTextContent(
            `Stable release v0.1.5.Compatible with DHIS2 2.39 and above.`
        )

        // app description
        expect(getByTestId('app-description')).toHaveTextContent(
            'The Global Fund ADEX Flow app provides a series of workflows to assist country teams with the management of Global Fund Related ADEX metadata.The app provides a series of pre-defined workflows:'
        )

        const sourceCodeLink = getByTestId('link-source-code')
        expect(sourceCodeLink.getAttribute('href')).toEqual(
            'https://github.com/dhis2/gf-adex-flow-app'
        )
        expect(sourceCodeLink).toHaveTextContent('Source code')

        expect(getByTestId('tabbar-appview')).toHaveTextContent(
            'About' + 'Previous releases' + 'Change log'
        )
    })
})
