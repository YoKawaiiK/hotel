const passport = require('koa-passport')

const google = require('./strategies/google')


passport.use('google', google)
