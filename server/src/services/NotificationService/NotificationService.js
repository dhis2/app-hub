const Schmervice = require('@hapipal/schmervice')
const { SlackWebhookMessager } = require('./SlackWebHookMessager.js')

class NotificationService extends Schmervice.Service {
    constructor(server, schmerviceOptions, { messagers }) {
        super(server, schmerviceOptions)

        if (!messagers || messagers.length < 1) {
            server.logger.warn(
                'No messagers provided to NotificationService, notifications will not be sent.'
            )
        } else {
            const messagersName = messagers.map((m) => m.name).join(', ')
            server.logger.info(
                `Init NotificationService with messagers: ${messagersName}`
            )
        }

        this.messagers = messagers
    }

    async sendNewAppNotifications({
        appName,
        imageUrl,
        link,
        organisationName,
        sourceUrl,
    }) {
        const newAppMessagers = this.messagers.filter(
            (m) => !!m.sendNewAppNotification
        )
        if (newAppMessagers.length < 1) {
            return Promise.resolve(null)
        }

        const promises = newAppMessagers.map((messager) => {
            this.server.logger.info(
                `Sending new app notification, using messager: ${messager.name}`
            )
            return messager.sendNewAppNotification({
                appName,
                imageUrl,
                link,
                organisationName,
                sourceUrl,
            })
        })
        return Promise.all(promises)
    }
}

const createNotificationService = (server, schmerviceOptions) => {
    const service = new NotificationService(server, schmerviceOptions, {
        messagers: createMessagers(server),
    })
    return Schmervice.withName('notificationService', service)
}

const createMessagers = (server) => {
    const messagers = []
    const { config } = server.realm.settings.bind
    if (config.slack?.webhookUrl) {
        const slackMessager = new SlackWebhookMessager(
            'slack',
            config.slack.webhookUrl
        )
        messagers.push(slackMessager)
    }
    return messagers
}

module.exports = { NotificationService, createNotificationService }
