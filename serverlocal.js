require('dotenv').config();
var express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const { dbConnect } = require('./config/postgres')
const bodyParser = require("body-parser");

app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());
dbConnect()

app.use(morgan('dev'))

app.use('/api/sendmailp2p', require('./src/routes')); 

app.listen(3070, () => {
    console.log('Server Server running on port 3070');
    console.log(process.env.DATABASE);
});