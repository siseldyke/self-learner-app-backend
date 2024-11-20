const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');

const testJWTRouter = require ('./controllers/test-jwt')
const usersRouter = require ('./controllers/users')
const profilesRouter = require('./controllers/profiles')
const questionareRouter = require('./controllers/questionares')
const categoriesRouter = require('./controllers/categories')

const PORT = process.env.PORT ? process.env.PORT : 3005;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());
app.use(cors())


app.listen(PORT, () => {
  console.log('The express app is ready!');
});


app.use('/test-jwt', testJWTRouter)
app.use('/users' , usersRouter)
app.use('/profiles', profilesRouter) 
app.use('/questionares' , questionareRouter)   
app.use('/categories', categoriesRouter)