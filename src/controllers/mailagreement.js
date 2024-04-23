let nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const aws = require('aws-sdk');

// Cancell
const mailAgreement = async (req, res) => {

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
  // console.log(req.params.to)
  // point to the template folder
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve(process.env.VIEW_PATH),
      defaultLayout: false
    },
    viewPath: path.resolve(process.env.VIEW_PATH)
  }

  // use a template file with nodemailer
  transporter.use('compile', hbs(handlebarOptions))
  let mailOptions
  mailOptions = {
    from: req.params.from,
    to: req.params.to,
    subject: 'Notificación desde NEAR P2P',
    template: 'emailagreement' // the name of the template file i.e email.handlebars
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      res.json(error)
    } else {
      // console.log('Email sent: ' + info.response);
      res.json(200)
    }
  })
}

module.exports = { mailAgreement }
