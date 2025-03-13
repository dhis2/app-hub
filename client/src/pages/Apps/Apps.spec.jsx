import '../../../test/mocks/setup.js'
import { renderWithRoute } from '../../../test/test-utils.jsx'
import Apps from './Apps.js'

describe('Apps list (Homepage)', () => {
    it('should render all app cards', async () => {
        const { findByText, getAllByTestId } = renderWithRoute(<Apps />)

        await findByText('Analytics Info')
        expect(getAllByTestId('appcard').length).toEqual(24)
        expect(getAllByTestId('appcard-name').length).toEqual(24)
        expect(getAllByTestId('appcard-organisation').length).toEqual(24)

        expect(getAllByTestId('appcard-description').length).toEqual(24)
    })
})
