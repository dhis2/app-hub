
exports.up = function(knex) {

    return knex.raw(
        `update app_version
        set version = replace(version, '_', '.')
        where version like '%$_%' ESCAPE '$'
    `)
};

exports.down = function(knex) {

    return knex.raw(
        `update app_version
        set version = replace(version, '.', '_')
        where version like '%$.%' ESCAPE '$'
    `)
};
