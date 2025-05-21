'use strict'

const Database = use('Database')
const PaystackService = use('App/Services/PaystackService')

class PaymentController {
  // Initialize payment
  async initialize({ request, response }) {
    const { email, amount, startup_id } = request.only(['email', 'amount', 'startup_id'])

    if (!email || !amount || !startup_id) {
      return response.status(400).json({ message: 'Email, amount, and startup_id are required' })
    }

    try {
      // Use your real forwarded IP or leave blank if not needed
      const forwardedIP = '105.119.10.94'

      const config = {
        headers: {
          'X-Forwarded-For': forwardedIP,
        },
      }

      // Call your Paystack service to initialize payment
      const result = await PaystackService.initializePayment(email, amount, config)

      return response.status(200).json({
        message: 'Payment initialized successfully',
        data: result,
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  // Verify payment
  async verify({ params, request, response }) {
    const reference = params.reference
    const startup_id = request.input('startup_id')

    if (!reference || !startup_id) {
      return response.status(400).json({ message: 'Reference and startup_id are required' })
    }

    try {
      const forwardedIP = '105.119.10.94'

      const config = {
        headers: {
          'X-Forwarded-For': forwardedIP,
        },
      }

      // Call your Paystack service to verify payment
      const result = await PaystackService.verifyPayment(reference, config)

      // Extract payment data
      const customer = result.data.customer
      const amount = result.data.amount
      const paystackId = result.data.id
      const paymentReference = result.data.reference
      const status = result.data.status

      if (!customer || amount === undefined) {
        return response.status(400).json({ message: 'Missing email or amount in Paystack response' })
      }

      const email = customer.email

      // Get startup info
      const startup = await Database
        .table('startups')
        .where('id', startup_id)
        .first()

      if (!startup) {
        return response.status(404).json({ message: 'Startup not found' })
      }

      const startupName = startup.startup_name

      // Save payment info to DB
      const savedPayment = await Database
        .table('payments')
        .insert({
          startup_id,
          startup_name: startupName,
          email,
          amount,
          payment_id: paystackId,
          payment_reference: paymentReference,
          status,
          created_at: new Date(),
          updated_at: new Date(),
        })

      return response.status(200).json({
        message: 'Payment verified and saved successfully',
        data: {
          payment: result,
          savedPayment,
        },
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }
  // GET /payments
async all({ response }) {
  try {
    const payments = await Database
      .from('payments')
      .select('*')
      .orderBy('created_at', 'desc')

    return response.status(200).json({
      message: 'Payments fetched successfully',
      data: payments,
    })
  } catch (error) {
    return response.status(500).json({ message: error.message })
  }
}
async callback({ request, response }) {
  try {
    const paystackSignature = request.header('x-paystack-signature')
    const payload = request.raw() // raw request body (buffer or string)

    // Verify signature to confirm request came from Paystack
    const crypto = require('crypto')
    const secret = process.env.PAYSTACK_SECRET_KEY
    const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex')

    if (hash !== paystackSignature) {
      return response.status(400).json({ message: 'Invalid signature' })
    }

    const event = request.input('event') // e.g. 'charge.success'
    const data = request.input('data')

    if (event === 'charge.success') {
      // Payment succeeded - save/update payment status in your DB
      await Database.table('payments').where('payment_reference', data.reference).update({
        status: data.status,
        updated_at: new Date(),
      })

      

      return response.status(200).json({ message: 'Payment verified and updated' })
    }

    // Handle other events if necessary
    return response.status(200).json({ message: 'Event ignored' })
  } catch (error) {
    console.error('Paystack callback error:', error)
    return response.status(500).json({ message: 'Internal server error' })
  }
}

  // GET /payments/:id
  async getById({ params, response }) {
    const { id } = params

    try {
      const payment = await Database
        .from('payments')
        .where('id', id)
        .first()

      if (!payment) {
        return response.status(404).json({ message: 'Payment not found' })
      }

      return response.status(200).json({
        message: 'Payment fetched successfully',
        data: payment,
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }
  // DELETE /payments/:id
  async delete({ params, response }) {
    const { id } = params

    try {
      const payment = await Database
        .from('payments')
        .where('id', id)
        .first()

      if (!payment) {
        return response.status(404).json({ message: 'Payment not found' })
      }

      await Database
        .from('payments')
        .where('id', id)
        .delete()

      return response.status(200).json({
        message: 'Payment deleted successfully',
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

}

module.exports = PaymentController
