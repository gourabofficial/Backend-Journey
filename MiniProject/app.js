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

app.get('/login', (req, res) => {
  res.render('login');
});

//profile route


app.get('/profile', isLogin, async (req, res) => {
  let user =  await userModel.findOne({ email: req.user.email }).populate({
    path: 'posts',
    populate: { path: 'user', select: 'username' }, 
  });

  res.render('profile', { user, posts: user.posts });
});



//post route

app.post('/post', isLogin, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  let{content} = req.body;
  console.log(content);
  console.log(user);

let post = await postModel.create({
    user: user._id,
    content
    
})
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');


});

//logout route

app.get('/logout', (req, res) => {
  res.cookie("token", "")
  res.send('logout successfully');

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

      let token = jwt.sign({ email: email, userid: user._id }, "ronaldo");
      res.cookie('token', token);
      res.send("Registerd Successfully");

    })
  });
});

// login route 

app.post('/login', async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).send('Somthing went wrong');
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email: email, userid: user._id }, "ronaldo");
      res.cookie('token', token);
      res.redirect("/profile");
    } else {
      res.redirect('/login')
    }
  });
})

function isLogin(req, res, next) {
  if (req.cookies.token === "") return res.redirect('/login');
  else {
    let data = jwt.verify(req.cookies.token, "ronaldo");
    req.user = data;
    next();
  }
}


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});