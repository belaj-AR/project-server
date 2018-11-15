const route = require('express').Router()

const UserController = require('../controllers/userController')
const isLogin = require('../middlewares/isLogin')
const { createNewAcount, getUserData, changeAvatar, getToken } = UserController
images = require('../helpers/images');

route
  .get('/', isLogin, getUserData)
  .post('/', createNewAcount)
  .post('/token', getToken)
  .put('/avatar', isLogin, images.multer.single('image'), images.sendUploadToGCS, changeAvatar)


module.exports = route
