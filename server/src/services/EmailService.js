const Schmervice = require('@hapipal/schmervice')
const Hapi = require('@hapi/hapi')
const Nodemailer = require('nodemailer')
const JWT = require('jsonwebtoken')
const AWS = require('aws-sdk')
const debug = require('debug')('apphub:server:service:EmailService')

const FROM_INFO = {
    name: 'DHIS2 App Hub',
    address: 'apphub@dhis2.org',
}
class EmailService extends Schmervice.Service {
    constructor(server, schmerviceOptions, serviceOptions) {
        super(server, schmerviceOptions)

        if (!serviceOptions.transport) {
            server.logger.warn(
                ['init', 'EmailService'],
                'EmailService is setup using "JSONTransport", emails will not be sent. Setup AWS-env to use AWS SES.'
            )
            this.transporter = Nodemailer.createTransport({
                jsonTransport: true,
            })
        } else {
            this.transporter = serviceOptions.transport
            debug(
                `EmailService initialized with transport ${this.transporter.transporter.name}`
            )
        }
    }

    async sendMail(sendTemplate) {
        const res = await this.transporter.sendMail(sendTemplate)
        if (this.transporter.transporter.name === 'JSONTransport') {
            debug('Send mail', res.message)
        }
        return res
    }

    async sendOrganisationInvitation(
        { emailTo, organisation, fromName },
        link
    ) {
        const sendTemplate = {
            from: FROM_INFO,
            to: emailTo,
            subject: 'You have been invited to an organisation',
            text: `Hi!\n 
${fromName} has invited you to join the organisation ${organisation} on App Hub. To accept the invitation, click the following link:\n
${link}\n
This invitation expires in 48 hours. If you accept you will be able to upload and manage apps on behalf of the organisation.`,
        }

        return this.sendMail(sendTemplate)
    }
}

const createEmailService = (server, schmerviceOptions) => {
    const { aws } = server.realm.settings.bind.config
    let transport

    if (
        process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        aws &&
        aws.region
    ) {
        const ses = new AWS.SES({
            region: aws.region,
            apiVersion: '2010-12-01',
        })
        transport = Nodemailer.createTransport({
            SES: {
                ses,
                aws: AWS,
            },
        })
    }

    const service = new EmailService(server, schmerviceOptions, {
        transport,
    })
    return Schmervice.withName('emailService', service)
}

module.exports = { EmailService, createEmailService }
