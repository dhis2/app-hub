import { render } from '@testing-library/react'
import ChangeLogViewer from './ChangeLogViewer'
import '../../../test/mocks/setup.js'

describe('Changelog viewer', () => {
    it('should show the changes', async () => {
        const appId = '70e2cbdd-568b-49fb-83fa-c20b3018da1a'

        const { findByText, getByTestId } = render(
            <ChangeLogViewer appId={appId} latestVersion="99.12.0" />
        )
        await findByText('Version 99.12.0')
        expect(getByTestId('dhis2-uicore-table')).toHaveTextContent(
            'Version 99.12.0Feature: enable template download | link' +
                'Version 99.11.0Feature: add OIDC Providers into UI | link' +
                'Version 99.10.1Fix: language clean up | link' +
                'Version 99.10.0Feature: add redirect for safe mode | link' +
                'Version 99.9.16Fix: update app name to match the bundled apps in core | link' +
                'Version 99.9.15Fix: remove html unescaping | link' +
                'Fix: remove html unescaping | link'
        )

        const baseVersionList = getByTestId('select-baseversion')
        expect(baseVersionList).toHaveTextContent('99.12.0')

        const compareversionList = getByTestId('select-compareversion')
        expect(compareversionList).toHaveTextContent('99.9.15')
    })
})
