const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const errCatcher = require('../helpers/errCatcher')

class ControllerUser {

  static changeAvatar(req, res) {
    User.updateOne({
        _id: req.decoded.id
      }, {
        avatar: req.file.cloudStoragePublicUrl
      })
      .then(data => {
        res.status(200).json({
          status: 'success',
          message: 'uploading file success'
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static getUserData(req, res) {
    User.findOne({
        _id: req.decoded.id
      })
      .then(data => {
        res.status(200).json({
          status: 'success',
          data: {
            id: data._id,
            fname: data.fname,
            avatar: data.avatar
          }
        })
      })
      .catch(err => {
        res.status(500).json({
          status: 'failed',
          message: err.message
        })
      })
  }

  static createNewAcount(req, res) {
    let data = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      uid: req.body.uid
    }

    let user = new User(data)

    user.save()
      .then(newUser => {
        res.status(201).json({
          status: 'success',
          message: `success creating new account with email ${newUser.email}`,
          data: data
        })
      })
      .catch(err => {
        console.log(err)
        let msg = errCatcher(err.message)
        if (msg.indexOf(',')) {
          msg = msg.split(',')[0]
        }
        res.status(500).json({
          status: 'failed',
          message: msg
        })
      })
  }
}

module.exports = ControllerUser
