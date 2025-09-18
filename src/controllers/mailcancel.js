var nodemailer = require('nodemailer'); 
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

// Cancel
const mailCancel = async (req, res) => {
  try {
    // Extract parameters from the URL - DIFFERENT PATTERN
    const from = req.params.from;
    const to = req.params.to;

    console.log('Extracted parameters:', { from, to });

    // Create simple SMTP transporter
    let transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL || 'email-smtp.us-east-2.amazonaws.com',
      port: process.env.PORT_EMAIL || 587,
      secure: false,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
      },
    });

    // Verify SMTP connection first
    await transporter.verify();
    console.log('SMTP connection verified');

    // point to the template folder - UPDATED PATH
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve(__dirname, '../views'),
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, '../views'),
    };
 
    // use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions))
    
    var mailOptions = {
      from: from,
      to: to,
      subject: 'Notificación desde NEAR P2P',
      template: 'emailsell',
      context: {
        order: 'N/A', // Since order isn't in the route, use default
        type: 'cancel', // Set type to cancel
        p1: '¡Orden cancelada!',
        p2: 'Hola, estás recibiendo este correo porque tu número de orden',
        p3: 'ha sido marcado como cancelado.',
      }
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

module.exports = { mailCancel }