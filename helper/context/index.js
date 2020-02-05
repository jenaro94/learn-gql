const jwt = require('jsonwebtoken')

module.exports.verifyUser = async (req) => {
  try {
    req.email = null
    console.log(req.headers)
    const bearerHeader = req.headers && req.headers.authorization
    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1]
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'mysecretkey')
      req.email = payload.email
    }
  } catch(err) {
    console.log(err)
    throw err
  }
}
