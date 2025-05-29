'use strict'

const Mail = use('Mail')

class NewsletterController {
  async subscribe({ request, response }) {
    const email = request.input('email')

    if (!email) {
      return response.status(400).send({ message: 'Email is required' })
    }

    try {
      await Mail.send((message) => {
        message
          .to(email)
          .from('info@grantty.com', 'Your Brand')
          .subject('🎉 Thanks for Subscribing!')
          .html(`
            <h1>Welcome!</h1>
            <p>Thanks for subscribing to our newsletter. We'll keep you updated!</p>
          `)
      })

      return response.status(200).send({ message: 'Newsletter sent successfully!' })
    } catch (error) {
      console.error('Mail error:', error)
      return response.status(500).send({ message: 'Failed to send newsletter email' })
    }
  }
}

module.exports = NewsletterController
