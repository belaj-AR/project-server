const router = require('express').Router();
const { addMatch, getMatchHistory, getOneMatch } = require('../controllers/matchController');
const { isLogin } = require('../middlewares');


router.use(isLogin);
router.get('/', getMatchHistory);
router.get('/:id', getOneMatch);
router.post('/', addMatch);

module.exports = router;