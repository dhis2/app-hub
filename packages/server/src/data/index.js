
const getCurrentUserAsync = async (request, knex) => {

    //TODO: implement
    return {
        id: 2
    }
}

const getOrganisationAsync = async (developer, knex) => {

    //TODO: implement
    return {
        id: 1
    }
}

const createOrganisationAsync = async (developer, knex) => {
    //TODO: implement
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

const addDeveloperToOrganisationAsync = async ({ developer, organisation }, knex) => {
    //TODO: implement
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
    getOrganisationAsync,
    createOrganisationAsync,
    getDeveloperAsync,
    createDeveloperAsync,
    addDeveloperToOrganisationAsync
}
