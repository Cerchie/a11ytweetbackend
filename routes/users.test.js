// npm packages
const request = require("supertest")
const db = require("../db")
const User = require("../models/user")
const { createToken } = require("../helpers/tokens")
// app imports
const app = require("../app")

// global auth variable to store things for all the tests
async function runBeforeAll() {
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM users")

    await User.register("u1", "password1")
    await User.register("u2", "password2")
    await User.register("u3", "password3")
}

async function runBeforeEach() {
    await db.query("BEGIN")
}

async function runAfterEach() {
    await db.query("ROLLBACK")
}

async function runAfterAll() {
    await db.end()
}

const u1Token = createToken({ username: "u1" })
const u2Token = createToken({ username: "u2" })

//call callbacks

beforeAll(runBeforeAll)
beforeEach(runBeforeEach)
afterEach(runAfterEach)
afterAll(runAfterAll)

describe("POST /users", function () {
    test("works for users", async function () {
        const resp = await request(app)
            .post("/users")
            .send({
                user: {
                    username: "u-new",
                    password: "password-new",
                },
            })
        expect(resp.statusCode).toEqual(201)
        expect(resp.body.user).toHaveProperty("username")
    })
    test("error if missing data", async function () {
        const resp = await request(app)
            .post("/users")
            .send({})
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(500)
    })
})

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
    test("works for same user", async function () {
        const resp = await request(app)
            .get(`/users/u1`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual({
            user: {
                username: "u1",
            },
        })
    })

    test("unauth for other users", async function () {
        const resp = await request(app)
            .get(`/users/u1`)
            .set("authorization", `Bearer ${u2Token}`)
        expect(resp.statusCode).toEqual(401)
    })

    test("unauth for anon", async function () {
        const resp = await request(app).get(`/users/u1`)
        expect(resp.statusCode).toEqual(401)
    })
})

/************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
    test("works for same user", async function () {
        const resp = await request(app)
            .patch(`/users/u1`)
            .send({
                username: "New",
            })
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual({
            user: {
                username: "New",
            },
        })
    })

    test("unauth if not same user", async function () {
        const resp = await request(app)
            .patch(`/users/u1`)
            .send({
                username: "NewT",
            })
            .set("authorization", `Bearer ${u2Token}`)
        expect(resp.statusCode).toEqual(401)
    })

    test("unauth for anon", async function () {
        const resp = await request(app).patch(`/users/u1`).send({
            username: "Newish",
        })
        expect(resp.statusCode).toEqual(401)
    })

    test("not found if no such user", async function () {
        const resp = await request(app)
            .patch(`/users/nope`)
            .send({
                username: "Nope",
            })
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(401)
    })

    test("works: can set new password", async function () {
        const resp = await request(app)
            .patch(`/users/u1`)
            .send({
                password: "new-password",
            })
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual({
            user: {
                username: "u1",
            },
        })
        const isSuccessful = await User.authenticate("u1", "new-password")
        expect(isSuccessful).toBeTruthy()
    })
})

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
    test("works for same user", async function () {
        const resp = await request(app)
            .delete(`/users/u1`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual({ deleted: "u1" })
    })

    test("unauth if not same user", async function () {
        const resp = await request(app)
            .delete(`/users/u1`)
            .set("authorization", `Bearer ${u2Token}`)
        expect(resp.statusCode).toEqual(401)
    })

    test("unauth for anon", async function () {
        const resp = await request(app).delete(`/users/u1`)
        expect(resp.statusCode).toEqual(401)
    })
})
