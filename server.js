/*
Plan=
Main endpoints of this api:
/ res ==> It's working
/signin ==> POST = success/fail
/register ==> POST = user
/profile/:userId ==> GET = user
/image ==> PUT ==> user image count
*/
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const salt = bcrypt.genSaltSync(10);

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB
    }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

// console.log(db.select('*').from('users').then(data => { console.log(data); }));

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt, salt); });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, salt); });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db); });

app.put('/image', (req, res) => { image.handleImage(req, res, db); });

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res); });


app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});

