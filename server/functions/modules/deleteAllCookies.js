const deleteAllCookies = (ctx) => {

  let cookies = ctx.header.cookie
    if (!cookies) {
      return false
    }

  const getNameAllCookies = (cookies) => { 
    let regex = new RegExp(' ?(.*?)=(.*?)($|;|,(?!))', 'gm')  
    let arrayCookiesName = [];
    for (const item of cookies.matchAll(regex)) {
      arrayCookiesName.push(item[1])
    }
    return arrayCookiesName;
  }

  const setNull = (arrayCookiesName) => {
    arrayCookiesName.forEach(cookie => {
      ctx.cookies.set(cookie, null)
    })
    return true
  }

  if (setNull(getNameAllCookies(cookies)) == true) {
    return true
  }
}

module.exports = deleteAllCookies