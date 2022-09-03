require('dotenv').config() // for using enviroment configuration

const express = require("express")
const app = express()

const mongoose = require("mongoose")
mongoose.connect(process.env.DB_URL)

// Allow the server accpet json
app.use(express.json())

const cors = require('cors')
app.use(cors())

// Using passport to verify token
const passport = require('passport')
app.use(passport.initialize())
require('./config/passport')(passport)

// Add User router
const usersRouter = require("./routes/users")
app.use("/api/users", usersRouter)

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => console.log("Server start listening on port " + PORT))