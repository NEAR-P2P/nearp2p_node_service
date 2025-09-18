const nodemailer = require('nodemailer'); 
const path = require('path');
const hbs = require('nodemailer-express-handlebars');

// Dispute
const mailDispute = async (req, res) => {
  try {
    // Extract parameters from the URL
    const [from, to] = req.params.emails.split(',');
    const order = req.params.order;
    const type = req.params.type;

    console.log('Extracted parameters:', { from, to, order, type });

    // Create SMTP transporter
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

    // Point to the template folder - UPDATED PATH
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve(__dirname, '../views'), // Path from controller file to views
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, '../views'), // Path from controller file to views
    };
   
    // Use a template file with nodemailer
    transporter.use('compile', hbs(handlebarOptions));
    
    const mailOptions = {
      from: from,
      to: to,
      subject: 'Notificación desde NEAR P2P',
      template: 'emailsell',
      context: {
        order: order,
        type: type,
        p1: '¡Orden en disputa!',
        p2: 'Hola, estás recibiendo este correo porque tu número de orden',
        p3: 'ha sido marcado como disputado.',
      }
    };

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

module.exports = { mailDispute };