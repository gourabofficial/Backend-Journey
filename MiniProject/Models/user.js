const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://jeetkoner:jeet123@cluster0.ljyr1.mongodb.net/`);

const userSchema = mongoose.Schema({

  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: Number,
  password: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
    }
  ]

});


module.exports = mongoose.model('user', userSchema);



