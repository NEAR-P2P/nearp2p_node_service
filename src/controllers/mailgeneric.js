const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
var nodemailer = require('nodemailer'); 
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

//Generic
const mailGeneric = async (req, res) => {

  const sesClient = new SESClient({
    region: 'us-east-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });

  let transporter = nodemailer.createTransport({
    SES: { ses: sesClient, aws: { SendEmailCommand } }
  });

  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve(process.env.VIEW_PATH),
        defaultLayout: false,
    },
    viewPath: path.resolve(process.env.VIEW_PATH),
  };
  
  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions))
  var mailOptions;
  if(req.params.type == 'sell'){
   mailOptions = {
      from: req.params.from,
      to: req.params.to,
      subject: 'Notificación desde NEAR P2P',
      template: 'emailsell', // the name of the template file i.e email.handlebars
      context:{
        order: req.params.order, // replace
        type: req.params.type, // replace
        p1: '¡Orden ejecutada exitosamente!',
        p2: 'Hola, estás recibiendo este correo porque tu número de orden',
        p3: 'ha sido marcado como completada.',
      }
   }
  }else{
    mailOptions = {
      from: req.params.from,
      to: req.params.to,
      subject: 'Notificación desde NEAR P2P',
      template: 'emailbuy', // the name of the template file i.e email.handlebars
      context:{
        order: req.params.order, // replace
        type: req.params.type, // replace
        p1: "¡Nuevo pedido realizado con éxito, por favor verifique!",
        p2: "Hola, estás recibiendo este correo porque tienes un nuevo pedido.",
      }
   }  
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
         console.log(error);
         res.json(error);
      } else {
         //console.log('Email sent: ' + info.response);
         res.json(200);
      }
  }); 

}

module.exports = { mailGeneric }