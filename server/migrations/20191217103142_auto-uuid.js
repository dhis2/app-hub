const tables = [
    'app',
    'app_channel',
    'app_status',
    'app_version',
    'app_version_localised',
    'app_version_media',
    'channel',
    'media_type',
    'review',
    'user_external_id',
    'users',
    'organisation',
]

exports.up = async knex => {
    try {
        const rawResult = await knex.raw(
            `select usesuper from pg_user where usename = CURRENT_USER;`
        )
        const [{ usesuper }] = rawResult.rows
        if (usesuper) {
            await knex.raw(`create extension if not exists "uuid-ossp"`)
        } else {
            console.warn(
                'Make sure to enable the extension uuid-ossp manually by running `create extension if not exists "uuid-ossp"` as a superuser'
            )
        }
    } catch (err) {
        console.error(
            'Could not create extension, are you running locally with not enough permissions for the db-user?',
            err
        )
    }

    //requires this to be run with correct privileges on the database: create extension if not exists "uuid-ossp"
    await Promise.all(tables.map(async table => setDefault(table, knex)))
}

exports.down = async knex => {
    await Promise.all(tables.map(async table => dropDefault(table, knex)))

    try {
        const rawResult = await knex.raw(
            `select usesuper from pg_user where usename = CURRENT_USER;`
        )
        const [{ usesuper }] = rawResult.rows
        if (usesuper) {
            await knex.raw(`drop extension if exists "uuid-ossp"`)
        } else {
            console.warn(
                'Make sure to drop the extension uuid-ossp manually by running `drop extension if exists "uuid-ossp"` as a superuser'
            )
        }
    } catch (err) {
        console.error(
            'Could not drop extension, are you running locally with not enough permissions for the db-user?',
            err
        )
    }
}

const setDefault = (channel, knex) =>
    knex.raw(
        `ALTER TABLE ${channel} ALTER COLUMN id SET DEFAULT uuid_generate_v4();`
    )
const dropDefault = (channel, knex) =>
    knex.raw(`ALTER TABLE ${channel} ALTER COLUMN id DROP DEFAULT;`)
