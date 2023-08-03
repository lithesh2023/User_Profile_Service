const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger.json'); // Create the swagger.json file in the same directory
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require("mongoose")

require('dotenv').config()



const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Connecting Database
const uri = process.env.MONOGO_DB_URL
console.log('uri',uri)
mongoose.connect(
   uri,
   { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
   console.log("Connected to database successfully");
})
.catch((err) => {
   console.log("Error connecting to MongoDB database", err.message);
});
// Dummy user data (replace this with a real database in a production app)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Passport local strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});


// Import and use your routes
app.use('/', require('./routes/users'));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
