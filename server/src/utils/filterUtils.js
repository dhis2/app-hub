// This cannot be in 'Filter.js'-file, as it results in a circular require
//  between CustomJoi and Filter

const SEPERATOR_CHAR = ':'

// Maps API-operators to DB-operators
const stringOperatorsMap = {
    ilike: 'ilike',
    like: 'like',
    in: 'in',
}

const isStringOperator = (operator) =>
    Object.keys(stringOperatorsMap).includes(operator)

const operatorMap = {
    eq: '=',
    lt: '<',
    gt: '>',
    lte: '<=',
    gte: '>=',
    ne: '<>',
}

// operators valid for version comparison
const versionOperatorMap = {
    ...operatorMap,
    in: 'in',
}

const isVersionOperator = (operator) =>
    Object.entries(versionOperatorMap)
        .flatMap((e) => e)
        .includes(operator)

const allOperatorsMap = {
    ...operatorMap,
    ...stringOperatorsMap,
}

const toSQLOperator = (operatorStr, value) => {
    const operator = allOperatorsMap[operatorStr]

    if (!operator) {
        throw new Error('Operator ', operatorStr, ' not supported.')
    }

    return operator
}

const parseFilterString = (filterStr) => {
    let operator
    const seperatorIdx = filterStr.indexOf(SEPERATOR_CHAR)
    if (seperatorIdx < 0) {
        operator = 'eq'
    } else {
        operator = filterStr.substring(0, seperatorIdx)
    }
    const value = filterStr.substring(seperatorIdx + 1)

    return {
        value,
        operator,
    }
}

module.exports = {
    allOperatorsMap,
    operatorMap,
    stringOperatorsMap,
    versionOperatorMap,
    isStringOperator,
    isVersionOperator,
    toSQLOperator,
    parseFilterString,
}
