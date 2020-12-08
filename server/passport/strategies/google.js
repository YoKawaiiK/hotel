const GoogleStrategy = require('passport-google-oauth20').Strategy
const db = require('../../database/index')

const google = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/auth/google/redirect`
  },
  async (token, tokenSecret, profile, done) => {

    try {
      const checkUser = await db.query(`
        SELECT 
          user_id, role_id, family_name, given_name, phone, passport
        FROM 
          users
        WHERE
          user_id = ${profile.id}
      `)
      // Найден
      if (typeof checkUser[0][0] != 'undefined') {
        // Объект найденого пользователя
        return done({
          user_id: profile.id,
          role_id: checkUser[0][0].role_id,
          family_name: checkUser[0][0].family_name,
          given_name: checkUser[0][0].given_name
        })
      }
      // Не найден
      else {
        // Создать пользователя
        const newUser = await db.query(`
          INSERT INTO users 
            (user_id, family_name, given_name, email, email_verified, role_id) 
          VALUES 
            (
              '${profile.id}', 
              '${profile.name.familyName}', 
              '${profile.name.givenName}', 
              '${profile.emails[0].value}', 
              ${profile.emails[0].verified},
              ${1}
            );
        `)
        if (newUser[0].warningStatus != 0) {
          return done({signInError: true})
        }
        
        // Создать счет для пользователя
        const newChecks = await db.query(`
          INSERT INTO checks 
            (user_id) 
          VALUES 
            (
              '${profile.id}'
            );
        `)
        if (newChecks[0].warningStatus != 0) {
          return done({createCheckError: true})
        }

        // Объект нового пользователя
        return done({
          user_id: profile.id,
          role_id: 1,
          family_name: profile.name.family_name,
          given_name: profile.name.given_name,
          email: profile.emails[0].value
        })
        
      }
    } 
    catch (error) {
      console.log(error);
      return done({error: true})
    }
  }
)

module.exports = google