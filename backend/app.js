require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');

// importe les routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const app = express();
app.disable("x-powered-by");
app.use(helmet());

// Définition des headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/images', express.static(path.join(__dirname, 'images')));
// L'application utilise ces routes
app.use('/api', userRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);

module.exports = app;