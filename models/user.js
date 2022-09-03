const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }, 
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: "None"
  },
  github: {
    type: String,
    default: ""
  },
  leetcode: {
    type: String,
    default: ""
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("User", userSchema)