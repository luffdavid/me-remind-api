const User = require('../models/UserModel')


// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    const userId  = user._id;
     // get the user's first name and last name from the database
     const userData = await User.findById(user._id)
     const { firstName, lastName} = userData
  

    res.status(200).json({userId, firstName, lastName, email  })
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
 const signupUser = async (req, res) => {
  const {firstName, lastName, email,  password} = req.body

  try {
    const user = await User.signup(firstName, lastName, email, password)
    const userId  = user._id;
    res.status(200).json({userId, firstName, lastName, email })
    
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = { signupUser, loginUser }