"use strict"

const jwt = require("jsonwebtoken")
const { UnauthorizedError } = require("../expressError")
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser } = require("./auth")
const ExpressError = require("../expressError")
const { SECRET_KEY } = require("../config")
const testJwt = jwt.sign({ username: "test" }, SECRET_KEY)
const badJwt = jwt.sign({ username: "test" }, "wrong")

describe("authenticateJWT", function () {
    test("works: via header", function () {
        const req = { headers: { authorization: `Bearer ${testJwt}` } }
        const res = { locals: {} }
        const next = function (err) {
            expect(err).toBeFalsy()
        }
        authenticateJWT(req, res, next)
        expect(res.locals).toEqual({
            user: {
                iat: expect.any(Number),
                username: "test",
            },
        })
    })

    test("works: no header", function () {
        const req = {}
        const res = { locals: {} }
        const next = function (err) {
            expect(err).toBeFalsy()
        }
        authenticateJWT(req, res, next)
        expect(res.locals).toEqual({})
    })

    test("works: invalid token", function () {
        const req = { headers: { authorization: `Bearer ${badJwt}` } }
        const res = { locals: {} }
        const next = function (err) {
            expect(err).toBeFalsy()
        }
        authenticateJWT(req, res, next)
        expect(res.locals).toEqual({})
    })
})

describe("ensureLoggedIn", function () {
    test("works", function () {
        const req = {}
        const res = { locals: { user: { username: "test" } } }
        const next = function (err) {
            expect(err).toBeFalsy()
        }
        ensureLoggedIn(req, res, next)
    })

    test("unauth if no login", function () {
        const req = {}
        const res = { locals: {} }
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy()
        }
        ensureLoggedIn(req, res, next)
    })
})

describe("ensureCorrectUser", function () {
    test("works: same user", function () {
        const req = { params: { username: "test" } }
        const res = { locals: { user: { username: "test" } } }
        const next = function (err) {
            expect(err).toBeFalsy()
        }
        ensureCorrectUser(req, res, next)
    })

    test("unauth: mismatch", function () {
        const req = { params: { username: "wrong" } }
        const res = { locals: { user: { username: "test" } } }
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy()
        }
        ensureCorrectUser(req, res, next)
    })

    test("unauth: if anon", function () {
        const req = { params: { username: "test" } }
        const res = { locals: {} }
        const next = function (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy()
        }
        ensureCorrectUser(req, res, next)
    })
})
