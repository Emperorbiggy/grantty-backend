'use strict'

const axios = require('axios')

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_BASE_URL = 'https://api.paystack.co'

class PaystackService {
  /**
   * Initialize a Paystack transaction
   * @param {string} email - Customer email
   * @param {number} amount - Amount in Naira
   * @returns {Promise<string>} - Authorization URL
   */
  static async initializePayment(email, amount, config = {}, callback_url) {
  try {
    const body = { email, amount: amount * 100 }
    if (callback_url) {
      body.callback_url = callback_url
    }

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      body,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
          ...config.headers,
        },
      }
    )

    const data = response.data

    if (data.status && data.data.authorization_url) {
      return data.data
    } else {
      throw new Error('Payment initialization failed. No authorization URL returned.')
    }
  } catch (error) {
    console.error('Initialize Payment Error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Payment initialization failed')
  }
}

  /**
   * Verify a Paystack transaction
   * @param {string} reference - Paystack transaction reference
   * @returns {Promise<object>} - Full verification data
   */
  static async verifyPayment(reference) {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          },
        }
      )

      return response.data
    } catch (error) {
      console.error('Verify Payment Error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Payment verification failed')
    }
  }
}

module.exports = PaystackService
