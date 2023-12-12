const express = require("express");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
require('dotenv').config()


// Parse JSON and urlencoded data with Express built-in middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Check the headers for autorization tokens
app.use((req, res, next) => {
    const auth = req.headers.authorization;

    const token = auth?.startsWith("Bearer") ? auth.slice(7) : null;

    try {
        req.user = jwt.verify(token, process.env.SECRET);
    } catch (error) {
        req.user = null
    }
    //log the current user
    console.log("USER: ", req.user);
    next();
});

app.use("/api", require("./api"));

app.use("/auth", require("./auth"));

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
