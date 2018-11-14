const route = require('express').Router()

const UserController = require('../controllers/userController')
const isLogin = require('../middlewares/isLogin')
const { createNewAcount, getUserData, changeAvatar } = UserController

route
  .get('/', isLogin, getUserData)
  .post('/', isLogin, createNewAcount)
  .put('/avatar', isLogin, changeAvatar)

module.exports = route
