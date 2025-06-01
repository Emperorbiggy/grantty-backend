'use strict'

const MailService = require('../../Services/MailService')
const NewsletterSubscriber = use('App/Models/NewsletterSubscriber')

class NewsletterController {
  async subscribe({ request, response }) {
    const email = request.input('email')

    if (!email) {
      return response.status(400).send({ message: 'Email is required' })
    }

    try {
      // Check if email already subscribed
      const existing = await NewsletterSubscriber.query().where('email', email).first()
      if (existing) {
        return response.status(409).send({ message: 'Email is already subscribed' })
      }

      // Store subscriber email
      await NewsletterSubscriber.create({ email })

      // Send newsletter email
      await MailService.sendNewsletterEmail(email)

      return response.status(200).send({ message: 'Newsletter sent successfully!' })
    } catch (error) {
      console.error('Mail error:', error)
      return response.status(500).send({ message: 'Failed to send newsletter email' })
    }
  }
}

module.exports = NewsletterController
