import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import mockAllAppsFirstPage from './apps/all-apps-first-page.js'
import mockAdexFlow from './appview/mock-adex-flow.js'
import mockChangelog from './appview/mock-changelog.js'
import mockDataVisualizerChangelog from './appview/mock-data-visualizer-changelog.js'
import mockDataVisualizerVersions from './appview/mock-data-visualizer-versions.js'
import mockDataVisualizerApp from './appview/mock-data-visualizer.js'

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

    // Data Visualizer (plugin and has changelog)
    http.get('/api/v1/apps/6f656971-c392-42d8-8363-eb37d9287f3d', () => {
        return HttpResponse.json(mockDataVisualizerApp)
    }),

    http.get(
        '/api/v2/apps/6f656971-c392-42d8-8363-eb37d9287f3d/changelog',
        () => {
            return HttpResponse.json(mockDataVisualizerChangelog)
        }
    ),

    http.get(
        '/api/v2/apps/6f656971-c392-42d8-8363-eb37d9287f3d/versions',
        () => {
            return HttpResponse.json(mockDataVisualizerVersions)
        }
    ),

    http.get(
        '/api/v2/apps/6f656971-c392-42d8-8363-eb37d9287f3d/channels',
        () => {
            return HttpResponse.json(['stable'])
        }
    ),
]

const server = setupServer(...handlers)

server.listen({
    onUnhandledRequest: 'error',
})
