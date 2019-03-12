

module.exports = (userId, orgId, appType, uuid, knex, transaction) =>  {

    if ( !userId ) {
        throw new Error(`Parameter missing: 'userId'`)
    }

    if ( !orgId ) {
        throw new Error(`Parameter missing: 'orgId'`)
    }

    if ( !appType ) {
        throw new Error(`Parameter missing: 'appType''`)
    }

    if ( !uuid ) {
        throw new Error(`Parameter missing: 'uuid'`)
    }

    if ( !knex ) {
        throw new Error(`Parameter missing: 'knex'`)
    }

    if ( !transaction ) {
        throw new Error(`Parameter missing: 'transaction'`)
    }

    return knex('app')
        .transacting(transaction)
        .insert({
            created_at: knex.fn.now(),
            created_by_user_id: userId,  //todo: change to real id
            organisation_id: orgId,     //todo: change to real id
            type: appType,
            uuid
        }).returning('id')
}
