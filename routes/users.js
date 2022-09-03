const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/user')

// $route POST users/register
router.post('/register', async (req, res) => {
  try {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          // if username is used
          res.status(400).json({ username: "username is already in use!" })
        } else {
          // creating a new user
          const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
          })

          // encrypting password
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
              if (err) throw err;
              newUser.password = hash;
              // saving the newUser
              newUser.save()
                .then(user => res.send(user))
                .catch(err => console.log(err))
            })
          })
        }
      })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// $route POST users/login
router.post('/login', async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ username: "Username does not exist!" })
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const rule = { id: user.id, username: user.username, github: user.github, leetcode: user.leetcode }
            jwt.sign(rule, "secret", { expiresIn: "2d" }, (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              })
            })
            // res.status(200).json({msg:"success"});
          } else {
            return res.status(400).json({ password: "Wrong password" })
          }
        })
    })
})

function resignToken(id, res) {
  User.findOne({ _id: id }).then(user => {
    const rule = { id: user.id, username: user.username, github: user.github, leetcode: user.leetcode }
    jwt.sign(rule, "secret", { expiresIn: "3d" }, (err, token) => {
      res.json({
        success: true,
        token: "Bearer " + token
      })
    })
  })
}

router.post('/connectgit/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.updateOne({ _id: req.params.id }, { $set: { github: req.body.github } }, (err, res) => {
    if (err) throw err;
  })
  resignToken(req.params.id, res);
})

router.post('/connectlc/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.updateOne({ _id: req.params.id }, { $set: { leetcode: req.body.leetcode } }, (err, res) => {
    if (err) throw err;
  })
  resignToken(req.params.id, res);
})

router.get('/', (req, res) => {
  res.send("success")
})

module.exports = router