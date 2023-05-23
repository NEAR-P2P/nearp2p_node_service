var nodemailer = require('nodemailer'); 
const path = require('path')
const hbs = require('nodemailer-express-handlebars')


//Generic
const mailGeneric = async (req, res) => {

   var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'admin@nearp2p.com',
      pass: 'BQVtDCqAjn'
    }
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
      subject: 'Notification from NEAR P2P',
      template: 'emailsell', // the name of the template file i.e email.handlebars
      context:{
        order: req.params.order, // replace
        type: req.params.type, // replace
        p1: 'Order Executed Successfully!',
        p2: 'Hello you are receiving this mail because your order number',
        p3: 'has been marked as completed.',
      }
   }
  }else{
    mailOptions = {
      from: req.params.from,
      to: req.params.to,
      subject: 'Notification from NEAR P2P',
      template: 'emailbuy', // the name of the template file i.e email.handlebars
      context:{
        order: req.params.order, // replace
        type: req.params.type, // replace
        p1: 'Successfully Placed new Order, please check!',
        p2: 'Hello you are receiving this mail because your have a new order',
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