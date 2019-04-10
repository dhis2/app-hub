const joi = require('joi')

/**
 * Finds an organisation by one of the optional parameters. If passing multiple they will be evaluated in the following order: id, uuid, name
 *
 * @param {string} uuid UUID for the organisation to get
 * @param {*} knex db instance
 * @returns {Promise<object>}
 */
module.exports.getOrganisationByUuid = async (uuid, knex) => {

    if ( !knex ) {
        throw new Error(`Missing knex instance passed as parameter.`)
    }

    const validation = joi.validate({ uuid }, { uuid: joi.string().guid().required() })
    if ( validation.error !== null ) {
        throw new Error(validation.error)
    }

    try {
        const [organisation] = await knex('organisation').select().where('uuid', uuid)
        return organisation
    } catch ( err ) {
        throw new Error(`Could not fetch organisation by uuid ${uuid}, ${err.message}.`)
    }
}

