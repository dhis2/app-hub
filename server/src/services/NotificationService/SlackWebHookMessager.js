const { IncomingWebhook } = require('@slack/webhook')
const debug = require('debug')(
    'apphub:server:services:NotificationService:SlackWebhookMessager'
)
const {
    NotificationMessager,
    messagerTypes,
} = require('./NotificationMessager.js')

class SlackWebhookMessager extends NotificationMessager {
    constructor(name, slackWebhookURL) {
        super(name, { type: messagerTypes.WEBHOOK })
        this.webhook = new IncomingWebhook(slackWebhookURL)
    }

    async send(slackWebHookSendArguments) {
        debug(
            'Sending notification',
            JSON.stringify(slackWebHookSendArguments, null, 2)
        )
        return this.webhook.send(slackWebHookSendArguments)
    }

    async sendNewAppNotification({
        appName,
        organisationName,
        imageUrl,
        sourceUrl,
        link,
    }) {
        // see https://app.slack.com/block-kit-builder
        const blocks = [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: 'A new app has been uploaded',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Name:*\n${appName}\n*Organisation:*\n${organisationName}`,
                },
                accessory: {
                    type: 'image',
                    image_url: imageUrl,
                    alt_text: 'app logo',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Source Code*:\n <${sourceUrl}>`,
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Review now',
                    },
                    url: link,
                },
            },
        ]

        return this.send({ blocks })
    }
}

module.exports = {
    default: SlackWebhookMessager,
    SlackWebhookMessager,
}
