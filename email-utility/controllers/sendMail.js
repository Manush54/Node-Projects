const nodemailer = require('nodemailer')

const sendMail = async(req, res) => {
    let testAccount = await nodemailer.createTestAccount();

    // connect with the smtp
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'houston39@ethereal.email',
            pass: 'qHENZsUgtpqVyNCFnZ'
        }
    });

    let info = await transporter.sendMail({
        from: '"Manush Shah" <manushs@gmail.com>',
        to: "manushshah.ict19@gmail.com",
        subject: "Hello Manush",
        text: "Hello Manush",
        html: "<b>Hello Manush</b>"
    })

    console.log("Message sent: %s", info.messageId)
    res.json(info)
}

module.exports = sendMail