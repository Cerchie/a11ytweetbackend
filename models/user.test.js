"use strict"

const db = require("../db.js")
const User = require("./user.js")
const bcrypt = require("bcrypt")
const { BCRYPT_WORK_FACTOR } = require("../config")

async function RunBeforeAll() {
    await db.query("DELETE FROM users")

    await db.query(
        `INSERT INTO users (username,
                      password)
                VALUES ('u1', $1),
                       ('u2', $2)
                RETURNING username`,
        [
            await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
            await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        ]
    )
}

async function RunBeforeEach() {
    await db.query("BEGIN")
}

async function RunAfterEach() {
    await db.query("ROLLBACK")
}

async function RunAfterAll() {
    await db.end()
}

beforeAll(RunBeforeAll) //waits for a promise to resolve before running
beforeEach(RunBeforeEach)
afterEach(RunAfterEach)
afterAll(RunAfterAll)
//testing auth method
describe("auth", function () {
    test("auth-method-works", async function () {
        const user = await User.authenticate("u1", "password1")

        expect(user).toEqual({
            username: "u1",
        })
    })
})
//testing reg method
describe("reg", function () {
    test("reg-method-works", async function () {
        const user = await User.register("u3", "password1")
        expect(user).toHaveProperty("username")
    })
})
//testing get method
describe("get", function () {
    test("get-method-works", async function () {
        const user = await User.get("u1")
        expect(user).toHaveProperty("username")
    })
})

//testing update method
describe("update", function () {
    test("update-method-works", async function () {
        const user = await User.update("u2", { password: "password" })
        expect(user).toEqual({
            username: "u2",
        })
    })
})
//testing remove method
describe("remove", function () {
    test("remove-method-works", async function () {
        await User.remove("u1")

        const res = await db.query("SELECT * FROM users WHERE username='u1'")
        expect(res.rows.length).toEqual(0)
    })
})
//pattern-- describe  route, pass in User method, test that result works
//adapted in part from Springboard solution https://github.com/Cerchie/react-jobly/blob/main/backend/models/user.test.js
