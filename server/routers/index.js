const Router = require('koa-router')

// this router in ./modules
const auth = require('./modules/auth')

const indexRouter = new Router()
// add all router
const mainRouter = [auth]

for (const router of mainRouter) {
    indexRouter
        .use(router.routes()) 
        .use(router.allowedMethods())
};

module.exports = indexRouter;