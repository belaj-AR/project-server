require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || 7001;

app.use(logger());
app.use(cors());

if (process.env.STAGE === 'test') {
  mongoose.connect(process.env.DB_TEST);
} else if (process.env.STAGE === 'dev') {
  mongoose.connect(process.env.DB_DEV);
} else if (process.env.STAGE === 'prod') {
  mongoose.connect(process.env.DB_PROD);
}

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`> DB connected to db stage `+ process.env.STAGE);
});

app.listen(port, () => {
  console.log(`\n> Server User running on port ${port}`);
})
