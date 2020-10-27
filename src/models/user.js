const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./account");

const userSchema = new mongoose.Schema({
  loginName: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  emailId: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate(value) {
      var i = 0;
      var numbers = 0;
      var caps = 0;
      var character = "";
      while (i <= value.length) {
        character = value.charAt(i);
        if (!isNaN(character * 1)) {
          numbers++;
        } else if (character == character.toUpperCase()) {
          caps++;
        }
        i++;
      }
      if (numbers == 0) {
        throw new Error("Password Should contain atleat one Number");
      }
      if (caps == 0) {
        throw new Error("Password should contian atleat one Capital Letter");
      }

      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.virtual("accounts", {
  ref: "Account",
  localField: "_id",
  foreignField: "createdBy",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "TechnicalTest");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

//Find user with credentials
userSchema.statics.findByCredentials = async (emailId, password) => {
  console.log(emailId);
  console.log(password);
  const user = await User.findOne({ emailId });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
