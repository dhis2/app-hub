

exports.seed = async knex => {

    const tables = (await knex
        .raw(`
                select tc.table_schema, tc.table_name, kc.column_name
                from information_schema.table_constraints tc
                join information_schema.key_column_usage kc 
                    on kc.table_name = tc.table_name and kc.table_schema = tc.table_schema and kc.constraint_name = tc.constraint_name
                where tc.constraint_type = 'PRIMARY KEY' AND tc.table_name NOT LIKE 'knex%'
                and kc.ordinal_position is not null
                order by tc.table_schema,
                        tc.table_name,
                        kc.position_in_unique_constraint;
            `)
        )
        .rows
        .map(r => ({table_name: r.table_name, column_name: r.column_name }))

    // reset serial sequence values
    await Promise.all(tables.map(async (obj) => {
        const { table_name, column_name } = obj
        console.log(`Reset serial sequence for table: ${table_name} with id ${column_name}`)
        return knex
            .raw(`
              SELECT
                setval(pg_get_serial_sequence('${table_name}', '${column_name}'),
                coalesce(max(${column_name}), 0) + 1, false)
              FROM "${table_name}";
            `)
        })
    )
}
