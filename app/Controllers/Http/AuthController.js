'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class AuthController {
  // Signup a new user
  async store({ request, response, auth }) {
  const { email, fullName, password } = request.only(['email', 'fullName', 'password'])

  try {
    const user = await User.create({
      email,
      full_name: fullName,
      password
    })

    // Generate JWT token for the new user
    const token = await auth.generate(user)

    return response.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: user,
      token: token.token // return JWT token here
    })
  } catch (error) {
    return response.status(400).json({
      status: 'error',
      message: 'Unable to create user',
      error: error.message
    })
  }
}


  // Login user
 async login({ request, auth, response }) {
  const { email, password } = request.only(['email', 'password'])

  try {
    const token = await auth.attempt(email, password)
    const user = await User.findBy('email', email)

    // Convert model instance to JSON and exclude password
    const userData = user.toJSON()
    delete userData.password

    return response.json({
      status: 'success',
      message: 'Login successful',
      data: {
        token: token.token,
        user: userData
      }
    })
  } catch (error) {
    return response.status(401).json({
      status: 'error',
      message: 'Invalid credentials',
      error: error.message
    })
  }
}

  // Get current logged-in user
async show({ auth, response }) {
  try {
    const user = await auth.getUser()
    return response.json({
      status: 'success',
      data: user
    })
  } catch (error) {
    return response.status(401).json({
      status: 'error',
      message: 'Not authenticated',
      error: error.message
    })
  }
}

// Update user info
async update({ request, auth, response }) {
  try {
    const user = await auth.getUser()
    const data = request.only(['email', 'fullName', 'password'])

    if (data.password) {
      data.password = await Hash.make(data.password)
    }

    user.merge(data)
    await user.save()

    return response.json({
      status: 'success',
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    // Check if the error is due to authentication failure
    if (error.name === 'InvalidJwtToken' || error.message.includes('jwt')) {
      return response.status(401).json({
        status: 'error',
        message: 'Not authenticated',
        error: error.message
      })
    }

    // Other errors return 400 bad request
    return response.status(400).json({
      status: 'error',
      message: 'Update failed',
      error: error.message
    })
  }
}


  // Logout user
  async logout({ auth, response }) {
    try {
      await auth.logout()
      return response.json({
        status: 'success',
        message: 'Logged out successfully'
      })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Logout failed',
        error: error.message
      })
    }
  }
}

module.exports = AuthController
