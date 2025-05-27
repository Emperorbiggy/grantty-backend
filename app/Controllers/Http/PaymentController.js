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
      const forwardedIP = '105.119.10.94'

      const config = {
        headers: {
          'X-Forwarded-For': forwardedIP,
        },
      }

      const result = await PaystackService.initializePayment(email, amount, config)

      return response.status(200).json({
        message: 'Payment initialized successfully',
        data: result,
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  // Verify payment (updated to prevent duplicate inserts)
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

      // Verify payment with Paystack
      const result = await PaystackService.verifyPayment(reference, config)

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

      // Check if payment with this reference already exists
      const existingPayment = await Database
        .table('payments')
        .where('payment_reference', paymentReference)
        .first()

      if (existingPayment) {
        // Update existing payment record (if needed)
        await Database
          .table('payments')
          .where('payment_reference', paymentReference)
          .update({
            status,
            amount,          // Update amount in case it changed
            updated_at: new Date(),
          })
      } else {
        // Insert new payment record
        await Database
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
      }

      // Update amount_raised atomically
      await Database
        .table('startups')
        .where('id', startup_id)
        .increment('amount_raised', amount)

      return response.status(200).json({
        message: 'Payment verified, saved/updated, and startup amount_raised updated successfully',
        data: {
          payment: result,
          existingPayment,
        },
      })
    } catch (error) {
      return response.status(500).json({ message: error.message })
    }
  }

  // GET /payments (optionally, you can apply distinct here if needed)
  async all({ response }) {
  try {
    const payments = await Database
      .from('payments')
      .select('*')
      .groupBy('payment_reference')
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

      const crypto = require('crypto')
      const secret = process.env.PAYSTACK_SECRET_KEY
      const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex')

      if (hash !== paystackSignature) {
        return response.status(400).json({ message: 'Invalid signature' })
      }

      const event = request.input('event') // e.g. 'charge.success'
      const data = request.input('data')

      if (event === 'charge.success') {
        // Update payment status on success event
        await Database.table('payments').where('payment_reference', data.reference).update({
          status: data.status,
          updated_at: new Date(),
        })

        return response.status(200).json({ message: 'Payment verified and updated' })
      }

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

  async getUserPayments({ auth, response }) {
  console.log('Auth object:', auth)

  try {
    const user = auth.user
    console.log('Authenticated user:', user)

    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' })
    }

    const email = user.email
    console.log('Fetching payments for email:', email)

    const payments = await Database
      .from('payments')
      .where('email', email)
      .select('*')

    if (payments.length === 0) {
      const msg = `Payment not found for email: ${email}`
      console.log(msg)
      return response.status(404).json({ message: msg })
    }

    return response.status(200).json({
      message: 'Payments fetched successfully',
      data: payments
    })

  } catch (error) {
    console.error('Error in getUserPayments:', error)
    return response.status(500).json({ error: 'Something went wrong' })
  }
}

}

module.exports = PaymentController
