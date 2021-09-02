const joi = require('joi')

const paramsSchema = joi.object().keys({
    id: joi.string().uuid(),
})

/**
 * Create a new organisation with the specified name
 *
 * @param {object} params
 * @param {string} params.id the id of the organisation to delete
 * @param {object} knex DB instance or transaction
 * @returns {Promise<boolean>} Returns true if successfully deleted >= 1 row
 */
const deleteOrganisation = async (params, knex) => {
    const validation = paramsSchema.validate(params)

    if (validation.error !== undefined) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    try {
        const deletedRows = await knex('organisation')
            .where(params)
            .delete()

        return deletedRows > 0
    } catch (err) {
        throw new Error(`Could not create organisation: ${err.message}`)
    }
}

module.exports = deleteOrganisation
