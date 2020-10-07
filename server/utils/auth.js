const jwt = require('jsonwebtoken')

const secret = 'asdfgrh5613556h15323h1ds3fg1q34hsdf2h135563515yh1sd32h1!@'
const expiration = '2h'

const auth = {
    signToken({username, email, _id}) {
        const payload = { username, email, _id }

        return jwt.sign({data: payload}, secret, {expiresIn: expiration})
    },
    authMiddleware({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization
        if (req.headers.authorization) {
            token = token  
                .split(' ')
                .pop()
                .trim()
        }
        if (!token) {
            return req
        }
        try {
            const { data } = jwt.verify(token, secret, {maxAge: expiration})
            req.user = data
        }
        catch {
            console.log("Invalid token")
        }
        return req
    }
}

module.exports = auth