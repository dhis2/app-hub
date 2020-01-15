const SEPERATOR_CHAR = ':'

const operatorMap = {
    eq: '=',
    ilike: 'ilike',
    like: 'like',
}

const toSQLOperator = operatorStr => {
    const operator = operatorMap[operatorStr]
    if (!operator) {
        throw new Error('Operator ', operatorStr, ' not supported.')
    }
    return operator
}

const applyFiltersToQuery = (filters, query, { tableName, columnMap }) => {
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

class Filter {
    constructor(field, value, operator = '=') {
        this.field = field
        this.value = value
        this.operator = operator
    }

    static createFromFilterString(field, filterStr) {
        let operator
        const seperatorIdx = filterStr.indexOf(SEPERATOR_CHAR)
        if (seperatorIdx < 0) {
            operator = '='
        } else {
            operatorStr = filterStr.substring(0, seperatorIdx)
            operator = toSQLOperator(operatorStr)
        }
        const value = filterStr.substring(seperatorIdx + 1)

        return new Filter(field, value, operator)
    }

    applyToQuery(query, { tableName }) {
        const colName = this.field
        if (colName) {
            query.where(
                tableName ? `${tableName}.${colName}` : colName,
                this.operator,
                this.value
            )
        }
    }
}

module.exports = {
    Filter,
}
