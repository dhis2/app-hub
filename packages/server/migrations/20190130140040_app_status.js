const { AppStatus } = require('../src/enums')

exports.up = async (knex) => {

    await knex.schema.createTable('app_status', (table) => {

        table
            .increments('id')
            .unsigned()
            .primary()

        table
            .integer('app_id')
            .unsigned()
            .notNullable()

        table
            .timestamp('created_at', true)
            .defaultTo(knex.fn.now())
            .notNullable()
            .index()

        table
            .integer('created_by_user_id')
            .unsigned()
            .notNullable()

        table.enu('status', [
            AppStatus.PENDING,
            AppStatus.NOT_APPROVED,
            AppStatus.APPROVED,
        ])

        table
            .foreign('app_id')
            .references('id')
            .inTable('app')
            .onDelete('CASCADE')

        table
            .foreign('created_by_user_id')
            .references('id')
            .inTable('users')
    })

}

exports.down = async (knex) => {

    await knex.schema.dropTable('app_status')
}
