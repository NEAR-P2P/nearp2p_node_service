/* eslint-disable camelcase */
const { CONFIG } = require('../network/api')
const nearAPI = require('near-api-js')
const { Contract, keyStores, KeyPair, Near, Account } = nearAPI
const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

// Callback autodispute
async function callbackFunction (arg) {
  // Near conection
  const keyStore = new keyStores.InMemoryKeyStore()
  // Connect to network
  const config = CONFIG(keyStore, arg[6])
  const CONTRACT_NAME = arg[7]
  const SIGNER_ID = arg[4]
  const SIGNER_PRIVATEKEY = arg[5]
  const NETWORK = arg[6]

  const keyPair = KeyPair.fromString(SIGNER_PRIVATEKEY)
  keyStore.setKey(NETWORK, SIGNER_ID, keyPair)
  const near = new Near(config)
  const account = new Account(near.connection, SIGNER_ID)
  const response = null

  // Contract call buy or sell
  const contract = new Contract(account, CONTRACT_NAME, {
    viewMethods: ['get_order_sell', 'get_order_buy'],
    changeMethods: ['dispute'],
    sender: account
  })

  // Validate if the order is a sell or a buy
  if (arg[3] === 'sell') {
    try {
      this.response = await contract.get_order_sell({
        order_id: parseInt(arg[2]),
        status: 1
      })
    } catch (err) {
      console.log(err)
    }
  } else {
    try {
      this.response = await contract.get_order_buy({
        order_id: parseInt(arg[2]),
        status: 1
      })
    } catch (err) {
      console.log(err)
    }
  }

  console.log(arg[2])
  // console.log(this.response.length);
  // If the order is not found
  if (this.response.length > 0) {
    const offer_type = 1
    if (arg[3] === 'sell') {
      this.offer_type = 1
    } else {
      this.offer_type = 2
    }
    try {
      this.response = await contract.dispute({
        callbackUrl: '', // callbackUrl after the transaction approved (optional)
        meta: 'some info', // meta info (optional)
        args: {
          offer_type,
          order_id: parseInt(arg[2]),
          token: arg[8]
        }
      })

      // console.log('Dispute');

      // Code here
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'admin@nearp2p.com',
          pass: 'BQVtDCqAjn'
        }
      })

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
        from: arg[0],
        to: arg[1],
        subject: 'Notification from NEAR P2P',
        template: 'emailsell', // the name of the template file i.e email.handlebars
        context: {
          order: arg[2], // replace
          type: arg[3], // replace
          p1: 'Order dispute!',
          p2: 'Hello you are receiving this mail because your order number',
          p3: 'has been marked as dispute.'
        }
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
    } catch (err) {
      console.log(err)
    }
  } else {
    console.log('Order not found')
  }
}

// AutoDispute
const autoDispute = async (req, res) => {
  // req.params.time*60000
  // callbackFunction([req.params.from, req.params.to, req.params.order, req.params.type, req.params.wallet, req.params.key, req.params.network, req.params.cn, req.params.token]), res;
  setTimeout(callbackFunction, 3000, [req.params.from, req.params.to, req.params.order, req.params.type, req.params.wallet, req.params.key, req.params.network, req.params.cn, req.params.token])
  // console.log(process.env.VIEW_PATH.toString())
  res.json(200)
}

module.exports = { autoDispute }
