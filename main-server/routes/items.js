const router = require('express').Router();
const Controller = require('../controllers/itemController');
const { isLogin, getCRUDToken } = require('../middlewares');


router.use(isLogin);
router.use(getCRUDToken);
router.get('/', Controller.getAll);
router.get('/:id', Controller.getOne);
router.post('/', Controller.addItem);

module.exports = router