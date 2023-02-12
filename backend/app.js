const express = require('express');

const app = express();
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
const  userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce')

app.use(express.json());
app.use(bodyparser.json())
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://<user>:<password>@formation.elxxu2d.mongodb.net/?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>console.log('Connexion a MongoDb réussie'))
.catch(()=>console.log('Connexion a MongoDb échoué !'))

app.use('/api/auth', userRoutes);

app.use('/api/sauces', sauceRoutes);

module.exports = app;
