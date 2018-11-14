const route = require('express').Router()

const UserController = require('../controllers/userController')
const isLogin = require('../middlewares/isLogin')
const { createNewAcount, getUserData, changeAvatar, getToken } = UserController

route
  .get('/', isLogin, getUserData)
  .post('/', createNewAcount)
  .post('/token', getToken)
  .put('/avatar', isLogin, changeAvatar)

module.exports = route
