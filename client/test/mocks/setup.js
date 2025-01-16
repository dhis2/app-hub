import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import mockAllAppsFirstPage from './apps/all-apps-first-page.js'
import mockAdexFlow from './appview/mock-adex-flow.js'
import mockChangelog from './appview/mock-changelog.js'

const handlers = [
    // single app: Adex Flow https://apps.dhis2.org/app/08c48425-abd3-410e-8802-8f9ada971c03
    http.get('/api/v1/apps/08c48425-abd3-410e-8802-8f9ada971c03', () => {
        return HttpResponse.json(mockAdexFlow)
    }),

    // all apps list
    http.get('/api/v2/apps', () => {
        return HttpResponse.json(mockAllAppsFirstPage)
    }),

    http.get(
        '/api/v2/apps/70e2cbdd-568b-49fb-83fa-c20b3018da1a/changelog',
        () => {
            return HttpResponse.json(mockChangelog)
        }
    ),
]

const server = setupServer(...handlers)

server.listen({
    onUnhandledRequest: 'error',
})
