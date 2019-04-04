





const createDeveloperAsync = async (developer, knex) => {
    //TODO: implement

}

const createTransaction = (knex) => {

    return new Promise((resolve) => {

        return knex.transaction(resolve);
    });
}

module.exports = {
    addAppVersionMediaAsync: require('./addAppVersionMediaAsync'),
    addAppVersionToChannelAsync: require('./addAppVersionToChannelAsync'),
    getAppsByStatusAndLanguageAsync: require('./getAppsByStatusAndLanguageAsync'),
    getAllAppsByLanguageAsync: require('./getAllAppsByLanguageAsync'),
    getAppsByUuidAndStatusAsync: require('./getAppsByUuidAndStatusAsync'),
    getAppsByUuidAsync: require('./getAppsByUuidAsync'),
    deleteAppAsync: require('./deleteAppAsync'),
    createAppAsync: require('./createAppAsync'),
    getOrganisationByUuidAsync: require('./getOrganisationByUuidAsync'),
    getOrganisationsByNameAsync: require('./getOrganisationsByNameAsync'),
    createOrganisationAsync: require('./createOrganisationAsync'),
    deleteOrganisationAsync: require('./deleteOrganisationAsync'),
    getDeveloperByEmailAsync: require('./getDeveloperByEmailAsync'),
    createDeveloperAsync,
    addDeveloperToOrganisationAsync: require('./addDeveloperToOrganisationAsync'),
    createTransaction
}
