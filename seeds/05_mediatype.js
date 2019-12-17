const seedData = require('./mock/media_type')

exports.seed = async knex => {
    console.log('Seeding media_type')

    const tableName = 'media_type'

    await knex(tableName).del()

    await knex(tableName).insert(seedData)
}
