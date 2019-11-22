
function applyFiltersToQuery(filters, query, { tableName, columnMap }) {
    for (k in filters) {
        const colName = columnMap ? columnMap[k] : k
        if (colName) {
            query.where(
                tableName ? `${tableName}.${colName}` : colName,
                '=',
                filters[k]
            )
        }
    }
    return
}

module.exports = {
    applyFiltersToQuery
}
