
exports.up = async function(knex, Promise) {
    // get all orgs
    const orgs = await knex('app')
        .distinct('organisation', 'address')
        .select()

    // get all the orgs with addresses
    const addresses = await knex('app')
        .distinct('organisation', 'address')
        .select()
        .whereNot('address', '')

    // merge in the existing addresses into the matching orgs...
    for (const org of orgs) {
        for (const address of addresses) {
            if (org.organisation === address.organisation) {
                org.address = address.address
            }
        }
    }

    // strip out duplicate orgs
    const new_orgs = orgs
        .filter((obj, pos, arr) => arr.map(x => x['organisation']).indexOf(obj['organisation']) === pos)
        .map(x => { return {
            name: x.organisation,
            address: x.address,
        }})

    // insert unique orgs into table
    await knex('organisations')
        .insert(new_orgs)
};

exports.down = async function(knex, Promise) {
    const orgs = await knex('organisations')
        .select('name', 'address')

    for (const { name, address } of orgs) {
        await knex('app')
            .where('organisation', 'like', name)
            .update({
                organisation: name,
                address: address,
            })
    }
};
