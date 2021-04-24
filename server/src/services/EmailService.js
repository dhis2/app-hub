const Schmervice = require('@hapipal/schmervice')
const Hapi = require('@hapi/hapi')
const Nodemailer = require('nodemailer')
const JWT = require('jsonwebtoken')
const AWS = require('aws-sdk')

class EmailService extends Schmervice.Service {
    // constructor(server, options) {
    //     super(server, options)
    //     console.log('got opz', options)
    // }

    async initialize() {
        const ses = new AWS.SES({
            region: 'eu-west-1',
            apiVersion: '2010-12-01',
        })
        this.ses = ses
        console.log(ses)    
        this.transporter = Nodemailer.createTransport({
            SES: {
                ses,
                aws: AWS,
            },
        })
        console.log('INITIALIZED TRANSPORTER')
    }

    async generateInvitation(fromUserId) {
        const secret = this.context.config.server.jwtSecret
        if (!secret) {
            throw new Error('No secret setup, set INTERNAL_JWT_SECRET')
        }

        const invitationObject = {
            from: '58262f57-4f38-45c5-a3c2-9e30ab3ba2da',
            to: 'test@gmail.com',
            sub: 'cedb4418-2417-4e72-bfcc-35ccd0dc3e41',
            organisation: 'DHIS2',
        }

        const token = JWT.sign(invitationObject, secret, {
            expiresIn: 60 * 60 * 24 * 7, //one week
        })
        return token
        // const secret = server.config.
    }

    async sendInvitation(link) {
        const name = 'Test'

        const res = await this.transporter.sendMail({
            from: 'apphub@dhis2.org',
            to: 'test@gmail.com',
            subject: 'You have been invited to a DHIS2 App Hub org',
            text: `Hi ${name}!\n 
You've been invited to join an organisation on DHIS2 App Hub. To accept the invitation, click the follow link:\n\n
${link}\n
This invitation expires in one week. If you accept you will be able to upload and manage apps for the organisation.`,
        })

        console.log('nodz', res)
    }
}

module.exports = EmailService
