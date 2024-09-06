var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const dbHelpers = require('./db/helpers/dbHelpers')(db);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const SECRET_KEY = process.env.SECRET_KEY;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter(dbHelpers));

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const userRecord = user.rows[0];
    const isMatch = await bcrypt.compare(password, userRecord.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password '});
    }

    //JWT token
    const token = jwt.sign({ userId: userRecord.id }, SECRET_KEY, { expiresIn: '1h' });

    //Token shot into a cookie, but defeats the purpose of jwt? Probably better to not have a cookie.
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 3600000,
    // });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { username, email, password, avatar, webcam } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if the username already exists
    const existingUsername = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const newUser = await db.query(
      'INSERT INTO users (username, password, email, avatar, webcam) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [username, hashedPassword, email, avatar, webcam]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id }, SECRET_KEY, { expiresIn: '1h' });

    //Token shot into a cookie, but defeats the purpose of jwt? Probably better to not have a cookie.
    // res.cookie('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 3600000, // 1 hour
    // });

    return res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = app;
