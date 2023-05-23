let nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

// Cancell
const mailAgreement = async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'admin@nearp2p.com',
      pass: 'BQVtDCqAjn'
    }
  })
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
    subject: 'Notification from NEAR P2P',
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
