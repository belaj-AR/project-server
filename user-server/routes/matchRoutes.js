const route = require('express').Router()

const isLogin = require('../middlewares/isLogin')
const { addMatch, getMatchHistory, getOneMatch } = require('../controllers/matchController');

route.use(isLogin);
route.get('/', getMatchHistory);
route.get('/:id', getOneMatch);
route.post('/', addMatch);

module.exports = route;
