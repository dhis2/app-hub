const Schmervice = require('@hapipal/schmervice')
const Hapi = require('@hapi/hapi')
const Nodemailer = require('nodemailer')
const JWT = require('jsonwebtoken')
const AWS = require('aws-sdk')

const FROM_INFO = {
    name: 'DHIS2 App Hub',
    address: 'apphub@dhis2.org',
}
class EmailService extends Schmervice.Service {
    // constructor(server, options) {
    //     super(server, options)
    //     console.log('got opz', options)
    // }

    async initialize() {
        // reads credentials from process.env
        const ses = new AWS.SES({
            region: 'eu-west-1',
            apiVersion: '2010-12-01',
        })
        this.ses = ses
        this.transporter = Nodemailer.createTransport({
            SES: {
                ses,
                aws: AWS,
            },
        })
        console.log('INITIALIZED TRANSPORTER')
    }

    async sendOrganisationInvitation({ emailTo, organisation }, link) {
        const sendTemplate = {
            from: FROM_INFO,
            to: emailTo,
            subject: 'You have been invited to an App Hub organisation',
            text: `Hi!\n 
You've been invited to join the organisation ${organisation} on DHIS2 App Hub. To accept the invitation, click the following link:\n
${link}\n
This invitation expires in one week. If you accept you will be able to upload and manage apps on behalf of the organisation.`,
        }
        return this.transporter.sendMail(sendTemplate)
    }
}

module.exports = EmailService
