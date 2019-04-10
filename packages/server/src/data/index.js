
const createTransaction = (knex) => {

    return new Promise((resolve) => {

        return knex.transaction(resolve);
    });
}

module.exports = {
    addAppVersionMedia: require('./addAppVersionMedia'),
    addAppVersionToChannel: require('./addAppVersionToChannel'),
    getAppsByStatusAndLanguage: require('./getAppsByStatusAndLanguage'),
    getAllAppsByLanguage: require('./getAllAppsByLanguage'),
    getAppsByUuidAndStatus: require('./getAppsByUuidAndStatus'),
    getAppsByUuid: require('./getAppsByUuid'),
    deleteApp: require('./deleteApp'),
    createApp: require('./createApp'),
    getOrganisationByUuid: require('./getOrganisationByUuid'),
    getOrganisationsByName: require('./getOrganisationsByName'),
    createOrganisation: require('./createOrganisation'),
    deleteOrganisation: require('./deleteOrganisation'),
    getUserByEmail: require('./getUserByEmail'),
    createUser: require('./createUser'),
    addUserToOrganisation: require('./addUserToOrganisation'),
    createTransaction
}
