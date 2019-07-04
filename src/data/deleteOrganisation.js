const joi = require('joi')

const paramsSchema = joi.object().keys({
    uuid: joi.string().uuid(),
})

/**
 * Create a new organisation with the specified name
 *
 * @param {object} params
 * @param {number} params.uuid the UUID of the organisation to delete
 * @param {*} knex
 * @returns {Promise<boolean>} Returns true if successfully deleted >= 1 row
 */
const deleteOrganisation = async (params, knex, transaction) => {
    const validation = joi.validate(params, paramsSchema)

    if (validation.error !== null) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    if (!transaction) {
        throw new Error('No transaction passed to function')
    }

    try {
        const deletedRows = await knex('organisation')
            .transacting(transaction)
            .where(params)
            .delete()

        return deletedRows > 0
    } catch (err) {
        throw new Error(`Could not create organisation: ${err.message}`)
    }
}

module.exports = deleteOrganisation
