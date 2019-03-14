const uuid = require('uuid/v4')

/**
 * Creates an app and returns the database id
 * @param {number} userId
 * @param {number} orgId
 * @param {*} appType
 * @param {object} knex
 * @param {object} transaction
 */
const createAppAsync = async (userId, orgId, appType, knex, transaction) =>  {

    if ( !userId ) {
        throw new Error(`Parameter missing: 'userId'`)
    }

    if ( !orgId ) {
        throw new Error(`Parameter missing: 'orgId'`)
    }

    if ( !appType ) {
        throw new Error(`Parameter missing: 'appType''`)
    }

    if ( !knex ) {
        throw new Error(`Parameter missing: 'knex'`)
    }

    if ( !transaction ) {
        throw new Error(`Parameter missing: 'transaction'`)
    }

    //generate a new uuid to insert
    const appUuid = uuid()

    const insertedAppId = await knex('app')
        .transacting(transaction)
        .insert({
            created_at: knex.fn.now(),
            created_by_user_id: userId,  //todo: change to real id
            organisation_id: orgId,     //todo: change to real id
            type: appType,
            uuid: appUuid
        }).returning('id')


    if ( !insertedAppId || insertedAppId[0] <= 0 ) {
        throw new Error('Could not insert app to database')
    }


    return {
        id: insertedAppId[0],
        uuid: appUuid,
    }
}


module.exports = createAppAsync
