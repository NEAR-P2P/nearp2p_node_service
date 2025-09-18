let nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

// Agreement
const mailAgreement = async (req, res) => {
  try {
    // Extract parameters from the URL - DIFFERENT PATTERN
    const to = req.params.to; // Only to address from URL
    const from = process.env.VERIFIED_SENDER_EMAIL; // Use a fixed verified sender email

    console.log('Extracted parameters:', { from, to });

    // Create simple SMTP transporter
    let transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL || 'email-smtp.us-east-2.amazonaws.com',
      port: process.env.PORT_EMAIL || 2587,
      secure: false,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
      },
    });

    // Verify SMTP connection first
    await transporter.verify();
    console.log('SMTP connection verified');

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve(__dirname, '../views'),
        defaultLayout: false
      },
      viewPath: path.resolve(__dirname, '../views')
    }

    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))
    
    let mailOptions = {
      from: from, // Use the fixed verified sender email
      to: to,     // Use the extracted to email from URL
      subject: 'Notificación desde NEAR P2P',
      template: 'emailagreement'
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully', 
      messageId: info.messageId 
    });
  } catch (error) {
    console.log('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

module.exports = { mailAgreement }