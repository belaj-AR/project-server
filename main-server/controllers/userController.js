const axios = require('axios')
const {uriServerUser} = require('../config')

module.exports = {

  login: function (req,res) {
    axios({
      method: 'POST',
      url: `${uriServerUser}/token`,
      data : {
        email: req.body.email,
        uid: req.body.uid
      }
    })
    .then((response) => {
      let user = response.data
      res.status(201).json({
        token: user.token
      })
    }).catch((err) => {
      let error = err.response.data
      res.status(500).json({
        message: error.message
      })

    });
  },

  register: function (req,res) {
    
    let data = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      uid: req.body.uid
    }
    
    axios({
      method: 'POST',
      url: `${uriServerUser}`,
      data
    })
    .then((response) => {
      let user = response.data
      res.status(201).json({
        status: user.status,
        message: user.message,
        data: user.data
      })
    }).catch((err) => {
      let error = err.response.data
      
      res.status(500).json({
        status: error.status,
        message: error.message
      })
    });

  },

  getUserData: function (req,res) {
   
    axios({
      method: 'GET',
      url: `${uriServerUser}`,
      headers: {
        token : req.headers.token
      }
    })
    .then((response) => {
      let user = response.data
      res.status(201).json({
        status: user.status,
        data: user.data
      })
    }).catch((err) => {
      let error = err.response.data
      res.status(201).json({
        status: error.status,
        data: error.message
      })
    });
  }

}