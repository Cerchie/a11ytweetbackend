/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")
const { UnauthorizedError } = require("../expressError")
const ExpressError = require("../expressError")

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim()
            res.locals.user = jwt.verify(token, SECRET_KEY)
        }
        return next()
    } catch (err) {
        return next()
    }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError()
        return next()
    } catch (err) {
        return next(err)
    }
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
    try {
        const user = res.locals.user
        if (!(user && user.username === req.params.username)) {
            throw new UnauthorizedError()
        }
        return next()
    } catch (err) {
        return next(err)
    }
}

// end

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureCorrectUser,
}
//adapted from my earlier Springboard project https://github.com/Cerchie/messagely/blob/main/middleware/auth.js
