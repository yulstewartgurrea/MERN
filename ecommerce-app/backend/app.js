const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')

const cookieParser = require('cookie-parser');

// import routes
const userAuthRoutes = require('./routes/user_auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')

//initialize express app
const app = express()

//import dotenv
require('dotenv').config();

// middlewares
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// routes
app.use('/api/v1', userAuthRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', productRoutes);

//database
mongoose
    .connect(process.env.DATABASE)
    .then(result => {
        console.log('DB Connected')
    })
    .catch(err => console.log(err))

// import port from .env file
const port = process.env.PORT || 8000;

// run application
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
