
const createTransaction = (knex) => {

    return new Promise((resolve) => {

        return knex.transaction(resolve);
    });
}

module.exports = {
    addAppVersionMedia: require('./addAppVersionMedia').addAppVersionMedia,
    addAppVersionToChannel: require('./addAppVersionToChannel').addAppVersionToChannel,
    getAppsByStatusAndLanguage: require('./getAppsByStatusAndLanguage').getAppsByStatusAndLanguage,
    getAllAppsByLanguage: require('./getAllAppsByLanguage').getAllAppsByLanguage,
    getAppsByUuidAndStatus: require('./getAppsByUuidAndStatus').getAppsByUuidAndStatus,
    getAppsByUuid: require('./getAppsByUuid').getAppsByUuid,
    deleteApp: require('./deleteApp').deleteApp,
    createApp: require('./createApp').createApp,
    getOrganisationByUuid: require('./getOrganisationByUuid').getOrganisationByUuid,
    getOrganisationsByName: require('./getOrganisationsByName').getOrganisationsByName,
    createOrganisation: require('./createOrganisation').createOrganisation,
    deleteOrganisation: require('./deleteOrganisation').deleteOrganisation,
    getUserByEmail: require('./getUserByEmail').getUserByEmail,
    createUser: require('./createUser').createUser,
    addUserToOrganisation: require('./addUserToOrganisation').addUserToOrganisation,
    createTransaction
}
