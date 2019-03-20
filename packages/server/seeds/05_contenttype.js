
exports.seed = async (knex) => {

    const tableName = 'content_type'

    const seedData = [
        {
            id: 1,
            description: 'Jpeg images',
            content_type: 'image/jpeg'
        },
        {
            id: 2,
            description: 'PNG images',
            content_type: 'image/png'
        }
    ]

    await knex(tableName).del()

    await knex(tableName).insert(seedData)

}
