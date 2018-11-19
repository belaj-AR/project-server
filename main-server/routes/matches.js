const router = require('express').Router();
const { addMatch, getMatchHistory, getOneMatch, removeMatch } = require('../controllers/matchController');
const { isLogin } = require('../middlewares');


router.use(isLogin);
router.get('/', getMatchHistory);
router.get('/:id', getOneMatch);
router.post('/', addMatch);
router.delete('/:id', removeMatch);

module.exports = router;