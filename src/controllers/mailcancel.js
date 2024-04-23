var nodemailer = require('nodemailer'); 
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const aws = require('aws-sdk');

//Cancell
const mailCancel = async (req, res) => {

  aws.config.update({
    accessKeyId: '123',
    secretAccessKey: '123',
    region: 'us-east-2' // e.g. 'us-west-2'
});

  let transporter = nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01'
    })
  });
//console.log(req.params.to)
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
  mailOptions = {
     from: req.params.from,
     to: req.params.to,
     subject: 'Notificación desde NEAR P2P',
     template: 'emailsell', // the name of the template file i.e email.handlebars
     context:{
       order: req.params.order, // replace
       type: req.params.type, // replace
       p1: '¡Orden cancelada!',
       p2: 'Hola, estás recibiendo este correo porque tu número de orden',
       p3: 'ha sido marcado como cancelado.',
     }
  }


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

module.exports = { mailCancel }