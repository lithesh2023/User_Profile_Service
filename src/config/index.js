require('dotenv').config()

module.exports = {
    db: process.env.MONGO_DB_URL,
    sessionSecret: 'developmentSessionSecret',
    facebook: {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: 'http://localhost:5000/oauth/facebook/callback'
    },
    google: {
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET,
        callbackURL: 'http://localhost:3000/oauth/google/callback'
 }

};