const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');

const testJWTRouter = require ('./controllers/test-jwt')
const usersRouter = require ('./controllers/users')
const profilesRouter = require('./controllers/profiles')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());
app.use(cors())
// Routes go here

app.listen(3005, () => {
  console.log('The express app is ready!');
});


app.use('/test-jwt', testJWTRouter)
app.use('/users' , usersRouter)
app.use('/profiles', profilesRouter)    