"use strict";

/** Database setup . */

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

const db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
        rejectUnauthorized: false,
    },
});

db.connect();

module.exports = db;
