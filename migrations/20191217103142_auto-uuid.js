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
]

exports.up = async knex => {
    //requires this to be run with correct privileges on the database: create extension if not exists "uuid-ossp"
    await Promise.all(tables.map(async table => setDefault(table, knex)))
}

exports.down = async knex => {
    await Promise.all(tables.map(async table => dropDefault(table, knex)))
}

const setDefault = (channel, knex) =>
    knex.raw(
        `ALTER TABLE ${channel} ALTER COLUMN id SET DEFAULT uuid_generate_v4();`
    )
const dropDefault = (channel, knex) =>
    knex.raw(`ALTER TABLE ${channel} ALTER COLUMN id DROP DEFAULT;`)
