const jwt = require('jsonwebtoken')
const { createToken } = require('./tokens')
const { SECRET_KEY } = require('../config')

describe('createToken', function () {
    test('works for user', function () {
        const token = createToken({ username: 'test' })
        const payload = jwt.verify(token, SECRET_KEY)
        expect(payload).toEqual({
            iat: expect.any(Number),
            username: 'test',
        })
    })
})
//code adapted from Springboard https://github.com/Cerchie/jobly-backend/blob/main/helpers/tokens.test.js
