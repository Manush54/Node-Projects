const sgMail = require("@sendgrid/mail");
const { convert } = require("html-to-text");

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends email via SendGrid with the specified details
 * @param {string} to -> Email id of the reciever
 * @param {string} subject -> Subject of the email
 * @param {string} body -> Body of the email. (Can be HTML or Simple Text)
 */
function send_email(to, subject, body) {
	text = convert(body);
	console.log(text);
	sgMail
		.send({
			to,
			from: "manushs@argusoft.com",
			subject,
			body,
			text,
		})
		.then(() => {
			console.log("Email sent");
		})
		.catch((error) => {
			console.error(error);
		});
}

module.exports = { send_email };
