const messagerTypes = {
    WEBHOOK: 'webhook',
    email: 'email',
}

class NotificationMessager {
    constructor(name, { type } = {}) {
        if (this.constructor === NotificationMessager) {
            throw new TypeError(
                'Class "NotificationMessager" cannot be instantiated directly.'
            )
        }
        this.name = name
        this.type = type
    }

    sendNotification() {
        throw new Error('Method "sendNotification" must be implemented.')
    }
}

module.exports = {
    messagerTypes,
    NotificationMessager,
}
