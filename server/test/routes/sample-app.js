const mockOrganisations = require('../../seeds/mock/organisations')

exports.sampleApp = {
    name: 'DHIS2 Sample App',
    description: 'A very nice sample description',
    appType: 'APP',
    sourceUrl: 'http://github.com',
    developer: {
        email: 'foobar@dhis2.org',
        organisationId: mockOrganisations[0].id,
    },
    version: {
        version: '1.0.0',
        minDhisVersion: '2.25',
        maxDhisVersion: '2.33',
        demoUrl: 'https://www.dhis2.org',
        channel: 'stable',
    },
}
