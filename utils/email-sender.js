const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: process.env.TEST_EMAIL_ID,
		pass: process.env.TEST_EMAIL_PASS,
	},
});

exports.sendEmail = (template, data) => {
	ejs.renderFile(
		path.join(__dirname, `../templates/${template}.ejs`),
		data,
		(err, str) => {
			const mailOptions = {
				from: "Yum Yum Pizza <admin@yumyum.com>",
				to: `${data.customerEmail}`,
				subject: `${data.subject}`,
				html: str,
			};

			transporter.sendMail(mailOptions).then((info) => {
				console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
			});

			if (err) {
				console.log(err.message);
			}
		}
	);
};
