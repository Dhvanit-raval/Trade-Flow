const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt"); 

const holdingSchema = new Schema({
  stockSymbol: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  averagePrice: {
    type: Number,
    required: true,
  }
});

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  holdings: [holdingSchema], 
});



module.exports = model("User", userSchema);