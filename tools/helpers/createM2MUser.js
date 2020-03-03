module.exports = async knex => {
    const userId = '58262f57-4f38-45c5-a3c2-9e30ab3ba2da'
    const orgId = 'cedb4418-2417-4e72-bfcc-35ccd0dc3e41'

    const transaction = await knex.transaction()

    try {
        await knex('users')
            .transacting(transaction)
            .insert([
                {
                    id: userId,
                    email: 'apphub-api@dhis2.org',
                    name: 'DHIS2 Bot',
                },
            ])
        await knex('user_external_id')
            .transacting(transaction)
            .insert([
                {
                    id: '46e00c3b-4668-4b93-bc6f-a46bc21f1e5d',
                    user_id: userId,
                    external_id: `${process.env.AUTH0_AUDIENCE}@clients`,
                },
            ])
        await knex('organisation')
            .transacting(transaction)
            .insert([
                {
                    id: 'cedb4418-2417-4e72-bfcc-35ccd0dc3e41',
                    name: 'DHIS2',
                    slug: 'dhis2',
                    created_by_user_id: userId,
                },
            ])
        await knex('user_organisation')
            .transacting(transaction)
            .insert([
                {
                    organisation_id: orgId,
                    user_id: userId,
                },
            ])
        transaction.commit()
        console.log(`Inserted API/M2M user successfully`)
    } catch (err) {
        console.log(`Could not create API/M2M user: ${err.message}`)
        transaction.rollback()
    }
}
