const router = require('express').Router()
const Controller = require('../controllers/itemController')

router.get('/', Controller.getAll);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.updateItem);
router.post('/', Controller.addItem);
router.delete('/:id', Controller.removeItem);

module.exports = router