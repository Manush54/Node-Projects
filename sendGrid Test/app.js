const { send_email } = require("./utils/sendEmails");

user = {
	email: "manushshah.ict19@gmail.com",
	name: "Manush",
};

send_email(
    user.email,
    `Hi ${user.name}, Welcome to DCH-WHO!!!`,
    `
    <h1>
        Hi, ${user.name}, Your account with Digital Clearing House has been created successfully!!
    </h1>`
);
