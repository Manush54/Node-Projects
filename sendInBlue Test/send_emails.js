const { send_email, sendSmtpEmail } = require("./send_in_blue_config");

const sibMail = sendSmtpEmail;

function send_signup_email(userEmail, userName) {
	sibMail.to = [{
		email: userEmail,
		name: userName,
	}];
	sibMail.subject = `${userName}, Welcome to DCH`;
	sibMail.htmlContent = `
        <html>
            <body>
                <h3>Hi ${userName}, </h3>
                <div>Your account with Digital Clearing House has been created successfully!!</div>
            </body>
        </html>`;
	sibMail.textContent = `Hi ${userName}, Your account with Digital Clearing House has been created successfully!!`;

	send_email(sibMail);
}

module.exports = send_signup_email;
