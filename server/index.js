'use strict'

// Library
const Koa = require('koa')

const passport = require('koa-passport')
require('./passport/index')

const bodyParser = require('koa-bodyparser')

// router
const router = require('./routers/index')

const middlewares = require('./middlewares/index')


const app = new Koa()

// koa used router
app
    .use(bodyParser())
    .use(passport.initialize())
    
for (const i of Object.keys(middlewares)) {
    app.use(middlewares[i])
}

app.use(router.routes())
    .use(router.allowedMethods())


// export server in nuxt.config.js
module.exports = {
    path: '/api',
    handler: app.callback()
}