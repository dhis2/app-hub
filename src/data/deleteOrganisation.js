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
const deleteOrganisation = async (params, knex) => {
    const validation = joi.validate(params, paramsSchema)

    if (validation.error !== null) {
        throw new Error(validation.error)
    }

    if (!knex) {
        throw new Error('Missing parameter: knex')
    }

    const transaction = await knex.transaction()
    try {
        const deletedRows = await knex('organisation')
            .transacting(transaction)
            .where(params)
            .delete()

        await transaction.commit()
        return deletedRows > 0
    } catch (err) {
        await transaction.rollback()
        throw new Error(`Could not create organisation: ${err.message}`)
    }
}

module.exports = deleteOrganisation
