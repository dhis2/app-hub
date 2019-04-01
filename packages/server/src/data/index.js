
const getCurrentUserAsync = async (request, knex) => {

    //TODO: implement
    return {
        id: 2
    }
}



const getDeveloperAsync = async (developer, knex) => {

    //TODO: implement
    return {
        id: 2
    }
}

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
    getCurrentUserAsync,
    getOrganisationByUuidAsync: require('./getOrganisationByUuidAsync'),
    getOrganisationByNameAsync: require('./getOrganisationByNameAsync'),
    createOrganisationAsync: require('./createOrganisationAsync'),
    deleteOrganisationAsync: require('./deleteOrganisationAsync'),
    getDeveloperAsync,
    createDeveloperAsync,
    addDeveloperToOrganisationAsync: require('./addDeveloperToOrganisationAsync'),
    createTransaction
}
