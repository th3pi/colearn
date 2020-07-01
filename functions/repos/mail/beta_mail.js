const nodemailer = require('nodemailer')

class BetaMail {
    constructor(password) {
        this.password = password;
    }

    sendBeta(toEmail, code) {

        return new Promise((resolve, reject) => {

            let transporter = nodemailer.createTransport({
                host: 'mail.privateemail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'support@colearn.tech',
                    pass: this.password,
                }
            })

            let mailOptions = {
                from: 'Support from Colearn <support@colearn.tech>',
                to: toEmail,
                subject: `You're in!`,
                text: 'Hello, \n\nThank you for your interest in Colearn! Keep an eye out for another email' +
                    ' from us in the coming weeks with your beta access code! \n\nYou will also be provided' +
                    ' with 4 extra codes to share with your friends and start learning together.' +
                    '\n\nBest regards, \nColearn Ninjas',
            }
            transporter.sendMail(mailOptions, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            });
        }
        )
    }
}

module.exports = BetaMail