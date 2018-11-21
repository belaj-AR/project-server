const route = require('express').Router();
const testingToken = require('../middlewares/testingToken');
const { resetDBTest } = require('../controllers/adminController');

route.use(testingToken);
route.post('/', resetDBTest);

module.exports = route;
