const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); //Authentication

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  googleId: { type: String },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
