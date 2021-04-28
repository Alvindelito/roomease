require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { User } = require('../database/index');

app.use(
  cors(
    {
    origin: 'http://localhost:3000',
    credentials: true,
  }
  )
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

let refreshTokens = [];

app.post('/token', (req, res) => {
  const {refreshToken} = req.cookies;
  console.log(`this is the fresh token ${refreshToken}`);
  if (refreshToken == null) return res.sendStatus(403);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.email }) //
    res.json({ accessToken: accessToken })
  });
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
})

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password

  try {
    let user = await User.findOne({ email: email });
    const match = await bcrypt.compare(user.password, plainTextPassword);

    const userTokenDetails = {
      id: user._id,
      email: user.email
    }

    const accessToken = generateAccessToken(userTokenDetails);
    const refreshToken = jwt.sign(userTokenDetails, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true: false,
      sameSite: 'strict'
    })


    res.status(200).json({
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }

})

const generateAccessToken = user => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
};

const PORT = 4000;

app.listen(PORT, console.log(`connected to port ${PORT}`));