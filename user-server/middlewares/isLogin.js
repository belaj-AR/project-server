const jwt = require('jsonwebtoken')

const isLogin = (req, res, next) => {
  let token = req.headers.token

  if (token) {
    let decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded) {
      req.decoded = decoded
      next()

    } else {
      res.status(500).json({
        status: 'failed',
        message: 'wrong token'
      })
    }
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'You need to login first'
    })
  }
}

module.exports = isLogin
