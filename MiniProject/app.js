const express = require('express');
const app = express();
const userModel = require('./Models/user')
const postModel = require('./Models/post')
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());


app.get('/', (req, res) => {
  res.render('index');
});

app.post('/register', async (req, res) => {
  let { email, password, username, name, age } = req.body;

  let user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).send('User already exists');
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await userModel.create({
        email,
        name,
        username,
        age,
        password: hash,
      })

      let token = jwt.sign({  email:email,userid:user._id}, "ronaldo");
      res.cookie('token', token);
      res.send("Registerd Successfully");

    })



  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});