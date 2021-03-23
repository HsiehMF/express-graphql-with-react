const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        req.isAuth = false
        return next()
    }
    // jwt format is: Bearer [toekn]
    const token = authHeader.split(' ')[1]
    if (!token || token === '') {
        req.isAuth = false
        return next()
    }

    let decodedToken
    try {
        // return {
        //      userId: '5fbe1a9d08298c64943c9041',
        //      email: 'mowli@test.com',
        //      iat: 1606298670,
        //      exp: 1606305870
        // }
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        req.isAuth = false
        return next()
    }

    if (!decodedToken) {
        req.isAuth = false
        return next()
    }

    req.isAuth = true
    req.userId = decodedToken.userId
    next()
}