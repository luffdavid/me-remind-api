const mongoose = require('mongoose')


const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
      },

    email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// static signup method
userSchema.statics.signup = async function(firstName, lastName, email, password) {

  // validation
  if (!email || !password || !firstName || !lastName) {
    throw Error('Error: All fields must be filled')
  }
  
//Email already in use?
  const exists = await this.findOne({ email })

  if (exists) {
    throw Error('Error: Email already in use')
  }

  
//hier wird der user in die datenbank geladen
  const user = await this.create({ firstName, lastName, email, password })
  return user;
}

// static login method
userSchema.statics.login = async function ( email, password) {

  if (!email || !password) {
    throw Error('Error: All fields must be filled')
  }

  const user = await this.findOne({ email})
  if (!user) {
    throw Error('Error: Incorrect email')
  }

  if (password !== user.password) {
    throw new Error('Error: Incorrect password');
  }

  return user;
}

module.exports = mongoose.model('User', userSchema)