
const createTransaction = (knex) => {
    return new Promise((resolve) => {
        return knex.transaction(resolve);
    });
}

module.exports = createTransaction
