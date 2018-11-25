const router = require('express').Router()
const userRouter = require('./users')
const itemRouter = require('./items')
const matchRouter = require('./matches');

router.use('/users', userRouter)
router.use('/items', itemRouter)
router.use('/matches', matchRouter)

module.exports = router;
