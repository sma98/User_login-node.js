const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/userRoute');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const app = express();

mongoose.connect('mongodb://localhost:27017/cdazzdev')
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));


app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3001', 'http://localhost:3000']
}));
app.use(express.json());
app.use('/api/users', users);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));