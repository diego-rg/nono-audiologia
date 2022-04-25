const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose"); //Authentication

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  googleID: { type: String },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
