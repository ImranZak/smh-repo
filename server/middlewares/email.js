const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'students4nyp@gmail.com', // Your email address
        pass: 'xkxa qzeh yydf xpnc'  // Your email password
    }
});

const sendQuizResultEmail = (to, quizTitle, score) => {
    const mailOptions = {
        from: 'students4nyp@gmail.com',
        to: to,
        subject: `Your Quiz Result for ${quizTitle}`,
        html: `<h1>Singapore Management Hub</h1><p>DO NOT RESPOND TO THIS EMAIL AS IT IS AUTO GENERATED! <br>You have completed the quiz "${quizTitle}" with a score of ${score}%.<p>`
    };

    return transporter.sendMail(mailOptions);
};

const sendVerifyEmail = (to, verificationCode) => {
    const mailOptions = {
        from: 'students4nyp@gmail.com',
        to: to,
        subject: `Verify your SMH account`,
        html: `<h1>Singapore Management Hub</h1><p>DO NOT RESPOND TO THIS EMAIL AS IT IS AUTO GENERATED! <br>Verification Code: ${verificationCode}<p>`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendQuizResultEmail, sendVerifyEmail };