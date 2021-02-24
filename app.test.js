const request = require('supertest')

const app = require('./app')
const db = require('./db')

test('not found for 404', async function () {
    const resp = await request(app).get('/invalid-path')
    expect(resp.statusCode).toEqual(404)
})

afterAll(function () {
    db.end()
})

//adapted from Springboard bootcamp setup: https://www.springboard.com/workshops/software-engineering-career-track
