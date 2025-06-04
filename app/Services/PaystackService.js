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
  static async initialize({ request, response }) {
  const { email, amount, startup_id } = request.only(['email', 'amount', 'startup_id']);
  
  if (!email || !amount || !startup_id) {
    return response.status(400).json({ message: 'Email, amount, and startup_id are required' });
  }

  try {
    const forwardedIP = '105.119.10.94';

    const config = {
      headers: {
        'X-Forwarded-For': forwardedIP,
      },
    };

    // Define your callback URL here, e.g. your frontend or backend route
    const callbackUrl = 'https://grantty.com/payment';

    const result = await PaystackService.initializePayment(email, amount, callbackUrl, config);

    return response.status(200).json({
      message: 'Payment initialized successfully',
      data: result,
    });
  } catch (error) {
    return response.status(500).json({ message: error.message });
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
