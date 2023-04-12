const SibApiV3Sdk = require("sib-api-v3-sdk");
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.sender = { name: "Manush Shah", email: "manushs@argusoft.com" };
sendSmtpEmail.replyTo = { name: "Manush Shah", email: "manushs@argusoft.com" };

sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };

function send_email(sibMail) {
    apiInstance.sendTransacEmail(sibMail).then(
        function (data) {
            console.log(
                "API called successfully. Returned data: " + JSON.stringify(data)
            );
        },
        function (error) {
            console.error(error);
        }
    );
}

module.exports = { send_email, sendSmtpEmail };
