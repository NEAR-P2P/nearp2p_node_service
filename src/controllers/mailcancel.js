var nodemailer = require('nodemailer'); 
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

//Cancell
const mailCancel = async (req, res) => {

  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
    user: 'admin@nearp2p.com',
    pass: 'BQVtDCqAjn'
   }
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
     subject: 'Notification from NEAR P2P',
     template: 'emailsell', // the name of the template file i.e email.handlebars
     context:{
       order: req.params.order, // replace
       type: req.params.type, // replace
       p1: 'Order cancelled!',
       p2: 'Hello you are receiving this mail because your order number',
       p3: 'has been marked as canceled.',
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