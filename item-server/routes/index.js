const express = require('express');
const router = express.Router();

const { getAll, getOne, updateItem, addItem, removeItem } = require('../controllers');
const { hasToken } = require('../middlewares');




router.use(hasToken);

router.get('/', getAll);

router.get('/:id', getOne);

router.put('/:id', updateItem);

router.post('/', addItem);

router.delete('/:id', removeItem);

module.exports = router;
