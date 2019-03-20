

module.exports = (uuid, knex) => {

    return knex('app').where('uuid', uuid).del()
}
