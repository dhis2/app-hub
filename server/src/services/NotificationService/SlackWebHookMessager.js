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

    /**
     * @param slackWebHookSendArguments
     * see https://github.com/slackapi/node-slack-sdk/blob/3498055d6c86beb82d51ddd583e123461379f5b7/packages/webhook/src/IncomingWebhook.ts#L99
     * shape of {
        username?: string;
        icon_emoji?: string;
        icon_url?: string;
        channel?: string;
        text?: string;
        link_names?: boolean;
        agent?: Agent;
        timeout?: number;
        attachments?: MessageAttachment[];
        blocks?: (KnownBlock | Block)[];
        unfurl_links?: boolean;
        unfurl_media?: boolean;
        metadata?: {
            event_type: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            event_payload: Record<string, any>;
        }
     */
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
                    text: `*Source code*:\n <${sourceUrl}>`,
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
