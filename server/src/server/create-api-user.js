exports.createApiUser = async (knex, transaction) => {
    if (!process.env.AUTH0_AUDIENCE) {
        return
    }

    let userId = '58262f57-4f38-45c5-a3c2-9e30ab3ba2da'
    let orgId = 'cedb4418-2417-4e72-bfcc-35ccd0dc3e41'

    const users = await knex('users').where('email', 'apphub-api@dhis2.org')
    if (users.length === 0) {
        await knex('users')
            .transacting(transaction)
            .insert([
                {
                    id: userId,
                    email: 'apphub-api@dhis2.org',
                    name: 'DHIS2 Bot',
                },
            ])
    } else {
        userId = users[0].id
    }

    const externalUserId = await knex('user_external_id').where({
        user_id: userId,
        external_id: `${process.env.AUTH0_AUDIENCE}@clients`,
    })

    if (externalUserId.length === 0) {
        await knex('user_external_id')
            .transacting(transaction)
            .insert([
                {
                    id: '46e00c3b-4668-4b93-bc6f-a46bc21f1e5d',
                    user_id: userId,
                    external_id: `${process.env.AUTH0_AUDIENCE}@clients`,
                },
            ])
    }

    const organisations = await knex('organisation').where('slug', 'dhis2')
    if (organisations.length === 0) {
        await knex('organisation')
            .transacting(transaction)
            .insert([
                {
                    id: orgId,
                    name: 'DHIS2',
                    slug: 'dhis2',
                    created_by_user_id: userId,
                },
            ])
    } else {
        orgId = organisations[0].id
    }

    const userOrganisation = await knex('user_organisation').where({
        organisation_id: orgId,
        user_id: userId,
    })
    if (userOrganisation.length === 0) {
        await knex('user_organisation')
            .transacting(transaction)
            .insert([
                {
                    organisation_id: orgId,
                    user_id: userId,
                },
            ])
    }
}
