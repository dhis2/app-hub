exports.seed = async knex => {
    console.log('Seeding media_type')

    const tableName = 'media_type'

    const seedData = [
        {
            id: 1,
            description: 'JPG/JPEG images',
            mime: 'image/jpeg',
        },
        {
            id: 2,
            description: 'PNG images',
            mime: 'image/png',
        },
    ]

    await knex(tableName).del()

    await knex(tableName).insert(seedData)
}
