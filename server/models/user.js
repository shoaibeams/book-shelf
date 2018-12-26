// const config = require("./../config/config").get(process.env.NODE_ENV);
const keys = require("./../config/keys");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_I = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  firstname: {
    type: String,
    maxLength: 100
  },
  lastname: {
    type: String,
    maxLength: 100
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }
});

userSchema.pre("save", function(next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function(err, salt) {
      if (err) return err;

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function(cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), keys.secretOrKey); //creates a token
  user.token = token;
  user.save(function(err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function(token, cb) {
  const user = this; //alias to user

  jwt.verify(token, keys.secretOrKey, function(err, decode) {
    user.findOne({ _id: decode, token: token }, function(err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

userSchema.methods.deleteToken = function(token, cb) {
  var user = this;
  user.update({ $unset: { token: 1 } }, (err, user) => {
    if (err) return cb(err);
    cb((null, user));
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
