const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger.json'); // Create the swagger.json file in the same directory
const session = require('express-session');
const passport = require('passport');
const mongoose = require("./config/db/mongoose")
const passportConfig = require("./config/passport")
const passportLocalStrategy  = require("./config/strategies/local")
const passportFacebookStrategy = require("./config/strategies/facebook")
flash = require('connect-flash'),
require('dotenv').config()

// Passport local strategy 
//need to modify this 
passportLocalStrategy()
passportFacebookStrategy()
passportConfig()
//connecting database
mongoose.connectDb()
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());







// Import and use your routes
const api = require('./routes/api')
app.use('/api', api)


// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('*', function (req, res) {
  res.status(404).send('Route Not Found')
})
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
