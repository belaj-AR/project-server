require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const userRoute = require('./routes/userRoutes')
const matchRoute = require('./routes/matchRoutes')

const app = express();
const port = process.env.PORT || 7001;
const db = mongoose.connection;

if (process.env.STAGE === 'prod') {
  mongoose.connect(process.env.DB_PROD, {
    useNewUrlParser: true
  });
} else if (process.env.STAGE === 'dev') {
  mongoose.connect(process.env.DB_DEV, {
    useNewUrlParser: true
  });
} else {
  mongoose.connect(process.env.DB_TEST, {
    useNewUrlParser: true
  });
}

mongoose.set('useCreateIndex', true)

if (process.env.STAGE == 'prod' || process.env.STAGE == 'dev') {
  app.use(logger());
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

app.use('/users', userRoute)
app.use('/matches', matchRoute)
app.use('/', (req, res) => {
  res.status(200).json({
    message: 'server user active'
  })
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`> DB connected to db stage `+ process.env.STAGE);
});

app.listen(port, () => {
  console.log(`\n> Server User running on port ${port}`);
})

module.exports = app
