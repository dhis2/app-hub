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
    //await knex.raw(`create extension if not exists "uuid-ossp"`)

    //requires this to be run with correct privileges on the database: create extension if not exists "uuid-ossp"
    await Promise.all(tables.map(async table => setDefault(table, knex)))
}

exports.down = async knex => {
    await Promise.all(tables.map(async table => dropDefault(table, knex)))

    //await knex.raw(`drop extension if exists "uuid-ossp"`)
}

const setDefault = (channel, knex) =>
    knex.raw(
        `ALTER TABLE ${channel} ALTER COLUMN id SET DEFAULT uuid_generate_v4();`
    )
const dropDefault = (channel, knex) =>
    knex.raw(`ALTER TABLE ${channel} ALTER COLUMN id DROP DEFAULT;`)
