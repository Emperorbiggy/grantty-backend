'use strict'
const MailService = require('../../Services/MailService')
const User = use('App/Models/User')
const Hash = use('Hash')
const Env = use('Env')

class AuthController {
  // Signup a new user
async store({ request, response, auth }) {
  const { email, full_name, password, user_type } = request.only([
    'email',
    'full_name',
    'password',
    'user_type'
  ])

  try {
    // ✅ Check if email already exists
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      return response.status(409).json({
        status: 'error',
        message: 'Email already in use'
      })
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    const user = await User.create({
      email,
      full_name,
      password,
      user_type,
      verification_code: verificationCode,
      is_verified: false,
    })

    // Send verification email
    await MailService.sendVerificationEmail(user.email, user.full_name, verificationCode)

    const token = await auth.generate(user)

    return response.status(201).json({
      status: 'success',
      message: 'User created successfully. A verification code has been sent to your email.',
      data: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        is_verified: user.is_verified
      },
      token: token.token,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return response.status(400).json({
      status: 'error',
      message: 'Unable to create user',
      error: error.message,
    })
  }
}
// Delete a user by ID
async deleteUser({ params, response }) {
  try {
    const user = await User.find(params.id)

    if (!user) {
      return response.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    await user.delete()

    return response.json({
      status: 'success',
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return response.status(500).json({
      status: 'error',
      message: 'Failed to delete user',
      error: error.message
    })
  }
}



async resendOtp({ request, response }) {
  const email = request.input('email')

  if (!email) {
    return response.status(400).json({
      status: 'error',
      message: 'Email is required',
    })
  }

  try {
    const user = await User.findBy('email', email)

    if (!user) {
      return response.status(404).json({
        status: 'error',
        message: 'User not found',
      })
    }

    if (user.is_verified) {
      return response.status(400).json({
        status: 'error',
        message: 'User already verified, please login',
      })
    }

    // Generate new verification code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString()

    user.verification_code = newCode
    await user.save()

    // Resend verification email
    await MailService.sendVerificationEmail(user.email, user.full_name, newCode)

    return response.status(200).json({
      status: 'success',
      message: 'Verification code resent successfully',
    })
  } catch (error) {
    console.error('Resend OTP error:', error)
    return response.status(500).json({
      status: 'error',
      message: 'Failed to resend verification code',
      error: error.message,
    })
  }
}


 async verifyOTP({ request, response }) {
  let { email, otp } = request.only(['email', 'otp'])

  try {
    // Trim and clean the email in case it has extra quotes
    email = email.replace(/^"+|"+$/g, '').trim()

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({ status: 'error', message: 'User not found' })
    }

    if (user.is_verified) {
      return response.status(400).json({ status: 'error', message: 'User already verified' })
    }

    if (user.verification_code === otp) {
      user.is_verified = true
      user.verification_code = null // clear code after verification
      await user.save()

      return response.json({ status: 'success', message: 'Email verified successfully' })
    } else {
      return response.status(400).json({ status: 'error', message: 'Invalid verification code' })
    }
  } catch (error) {
    console.error('verifyOTP error:', error)
    return response.status(500).json({ status: 'error', message: 'Something went wrong' })
  }
}

async fetchAllUsers({ response }) {
    const users = await User.all()

    return response.status(200).json({
      status: 'success',
      data: users
    })
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
