const express = require('express')

const { signup, login } = require('../controllers/auth.js') // "Cannot use import statement outside a module"

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

module.exports = router