
const Router = require('koa-router')

// passport auth
const passport = require('koa-passport')
const jwt = require('jsonwebtoken')

const db = require('../../database')
const { deleteAllCookies } = require('../../functions/index')

const auth = new Router({ prefix: '/auth' })

auth
  .get(
    '/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
  )
  .get('/google/redirect', async (ctx) => {
    await passport.authenticate('google', (result) => {

      // Если уже был вход
      const token = ctx.cookies.get('jwt')
      if (token) {
        ctx.redirect(`/profile/${result.user_id}`)
        return 
      }

      if (result.error || result.signInError) {
        ctx.redirect('/auth')
        return true;
      } else {
        ctx.redirect(`/profile/${result.id}`)
        
        // save token like accept login

        const expiresCookie = Math.floor(
          Date.now() + parseInt(process.env.JWT_EXPIRES_IN)
        )

        const token = jwt.sign(
          {
            exp: expiresCookie / 1000,
            data: {
              user_id: result.user_id,
              role_id: result.role_id,
            },
          },
          process.env.JWT_KEY
          // {
          //   expiresIn: maxAge
          // }
        )

        ctx.cookies.set('jwt', token, {
          expires: new Date(expiresCookie),
        })

        // Создается, чтобы можно было установить действвие куки на стороне пользователя
        result['expiresCookie'] = expiresCookie

        for (const key in result) {
          ctx.cookies.set(key, JSON.stringify(result[key]), {
            httpOnly: false,
            expires: new Date(expiresCookie),
          })
        }

        return true
      }
    })(ctx)
  })
  .get('/cookies/delete', async (ctx) => {
    try {
      // custom functions for delete all cookies
      if (!deleteAllCookies(ctx)) {
        ctx.body = { cookies: false }
      }
    } 
    catch (error) {
      console.log(error);
      return (ctx.body = { deleted: false })
    }
    ctx.body = { deleted: true }
  })
  .post('/login/set', async (ctx) => {
    try {

      const user_id = ctx.state.user.user_id

      const login = await ctx.request.body.login

      const setLogin = await db.query(`
        UPDATE users 
        SET login = '${login}' 
        WHERE (user_id = '${user_id}');
      `)
      if (!setLogin[0].warningStatus) {
        new Error('error setLogin')
      }
    } catch (error) {
      ctx.body = { setLogin: false }
      return false
    }

    ctx.body = { setLogin: true }
  })

module.exports = auth
