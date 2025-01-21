import { useAuth0 } from '@auth0/auth0-react'
import { fireEvent, within } from '@testing-library/react'
import { renderWithRoute } from '../../../test/test-utils.jsx'
import '../../../test/mocks/setup.js'
import AppView from './AppView.js'

jest.mock('@auth0/auth0-react')

describe('AppView', () => {
    beforeEach(() => {
        useAuth0.mockReturnValue({
            getAccessTokenSilently: jest.fn(),
        })
    })
    it('should render app details', async () => {
        const appId = '08c48425-abd3-410e-8802-8f9ada971c03'

        const { findByText, getByTestId } = renderWithRoute(
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
            'About' + 'Previous releases'
        )
    })

    describe('previous release tab', () => {
        const renderChangelogTab = async () => {
            // Data Visualizer
            const appId = '6f656971-c392-42d8-8363-eb37d9287f3d'

            const app = renderWithRoute(
                <AppView
                    match={{
                        params: { appId },
                    }}
                />
            )

            await fireEvent.click(await app.findByText('Previous releases'))

            expect(await app.findByText('100.8.6')).toBeDefined()

            return app
        }
        it('should show versions numbers headers', async () => {
            const { getByText } = await renderChangelogTab()
            getByText('100.8.5')
            getByText('100.8.4')
            getByText('100.8.3')
            getByText('100.8.2')
        })
        it('should show versions info with download link', async () => {
            const { getAllByTestId } = await renderChangelogTab()
            const [firstVersion] = getAllByTestId('version-list-item')

            expect(firstVersion).toHaveTextContent('17')
            expect(firstVersion).toHaveTextContent('December')
            expect(firstVersion).toHaveTextContent('2024')
            expect(firstVersion).toHaveTextContent(
                '0 downloads' + 'Stable' + 'DHIS2 2.39 and above'
            )

            expect(within(firstVersion).getByText('Download')).toHaveAttribute(
                'href',
                expect.stringMatching(
                    '/api/v2/apps/6f656971-c392-42d8-8363-eb37d9287f3d/download/data-visualizer_100.8.6.zip'
                )
            )
        })
        it('should each version changelog', async () => {
            const { getAllByTestId } = await renderChangelogTab()
            const [firstVersion, secondVersion, ...otherVersions] =
                getAllByTestId('version-list-item')

            expect(firstVersion).toHaveTextContent(
                'Fix: enable ou tree and levels/groups with user orgunits and display translated title (link)'
            )

            expect(secondVersion).toHaveTextContent(
                'Fix: handle single value vis-type as highcharts chart instance (link)'
            )

            expect(otherVersions).toHaveLength(3)
        })
    })
})
