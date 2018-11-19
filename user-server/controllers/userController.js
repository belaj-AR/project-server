const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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

  static getToken(req, res) {
    User.findOne({ email: req.body.email })
      .then(data => {
        if (data) {
          let token = jwt.sign({
            id: data._id,
            email: data.email,
            uid: req.body.uid
          }, process.env.JWT_SECRET)
          res.status(201).json({
            token
          })
        } else {
          res.status(500).json({
            message: 'wrong user data'
          })
        }

      })
      .catch(err => {
        res.status(500).json({
          message: 'error when generating token'
        })
      })
  }

  static getUserData(req, res) {
    
    User.findOne({
        _id: req.decoded.id
      }).populate('win lose')
      .then(data => {
        
      if (data) {     
          if (bcrypt.compareSync(req.decoded.uid, data.uid)) {
            
            res.status(200).json({
              status: 'success',
              data: {
                id: data._id,
                email: data.email,
                fname: data.fname,
                avatar: data.avatar,
                role: data.role,
                win: data.win,
                lose: data.lose,
              }
            })
          } else {
            
            res.status(500).json({
              status: 'failed',
              message: 'wrong token or user not found'
            })  
          }
        } else {
          res.status(500).json({
            status: 'failed',
            message: 'user not found'
          })
        }
      })
      .catch(err => {

        let message = err.message

        if (err.message.indexOf("ObjectId")) {
          message = "wrong token or user not found"
        }
        res.status(500).json({
          status: 'failed',
          message: message
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
