const express = require('express');
const router = express.Router();

const { getAll, getOne, updateItem, addItem, removeItem } = require('../controllers');
const { resetDBTest } = require('../controllers/adminController');
const { hasToken, TestingToken } = require('../middlewares');

router.post('/admin', TestingToken, resetDBTest);
router.use(hasToken);
router.get('/', getAll);
router.get('/:id', getOne);
router.put('/:id', updateItem);
router.post('/', addItem);
router.delete('/:id', removeItem);

module.exports = router;
