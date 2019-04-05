

function flatten(arr, result = []) {
    for (let i = 0, length = arr.length; i < length; i++) {
        const value = arr[i]

        if (Array.isArray(value)) {
            flatten(value, result)
        } else {
            result.push(value)
        }
    }

    return result
}

const getCurrentUserFromRequest = (request, knex) => {

    let user = null

    if ( request !== null && request.auth !== null && request.auth.credentials !== null ) {
        user = {
            id: request.auth.credentials.userId,
            email: request.auth.credentials.email,
            uuid: request.auth.credentials.uuid
        }
    }

    return user
}

module.exports = {
    flatten, 
    AWSFileHandler: require('./AWSFileHandler'),
    getCurrentUserFromRequest
}
