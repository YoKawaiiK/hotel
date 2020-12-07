const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
  const token = ctx.cookies.get('jwt')

  if (typeof token == 'undefined') {
    // Если не было токена в cookies
    await next()
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Сохранить в временное хранилище для следующего обработчика
    ctx.state.user = {
      user_id: decoded.data.user_id,
      role_id: decoded.data.role_id
    }

    await next()
  } 
  catch (error) {
    if (error.name == 'TokenExpiredError') {
      ctx.body = {session: false}
    } 
    else  {
      console.log(error);
      ctx.body = {error: true}
    }
  }
}