"use strict";

const express = require("express"); //grabbing express

const { NotFoundError } = require("./expressError"); //going to need this for rendering routes

const { authenticateJWT } = require("./middleware/auth"); //going to need this for rendering JWT

const usersRoutes = require("./routes/users"); //routes for user functionality

const morgan = require("morgan"); //to help us read console output better

const app = express(); //revving up the app

const cors = require("cors");

//registering our middleware below
app.use(express.json());
app.use(morgan("tiny"));

app.use(cors({ origin: "https://clever-kare-b13870.netlify.app" }));

app.use(authenticateJWT);

//establishing first url subdirectories

app.use("/users", usersRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});
/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;
//adapted from Springboard bootcamp setup https://www.springboard.com/workshops/software-engineering-career-track
