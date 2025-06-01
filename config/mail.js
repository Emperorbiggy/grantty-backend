'use strict'

const Env = use('Env')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Mail Connection
  |--------------------------------------------------------------------------
  */
  connection: Env.get('MAIL_CONNECTION', 'smtp'),

  /*
  |--------------------------------------------------------------------------
  | SMTP Configuration
  |--------------------------------------------------------------------------
  */
  smtp: {
    driver: 'smtp',
    pool: true,
    port: Env.get('SMTP_PORT', 465), // aligns with .env: SMTP_PORT
    host: Env.get('SMTP_HOST'),      // aligns with .env: SMTP_HOST
    secure: Env.get('SMTP_SECURE', 'false') === 'true', // force boolean
    auth: {
      user: Env.get('MAIL_USERNAME'),
      pass: Env.get('MAIL_PASSWORD'),
    },
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 10,
  },

  /*
  |--------------------------------------------------------------------------
  | SparkPost Configuration
  |--------------------------------------------------------------------------
  */
  sparkpost: {
    driver: 'sparkpost',
    apiKey: Env.get('SPARKPOST_API_KEY'),
    extras: {}
  },

  /*
  |--------------------------------------------------------------------------
  | Mailgun Configuration
  |--------------------------------------------------------------------------
  */
  mailgun: {
    driver: 'mailgun',
    domain: Env.get('MAILGUN_DOMAIN'),
    apiKey: Env.get('MAILGUN_API_KEY'),
    region: Env.get('MAILGUN_API_REGION'),
    extras: {}
  },

  /*
  |--------------------------------------------------------------------------
  | Ethereal Configuration
  |--------------------------------------------------------------------------
  */
  ethereal: {
    driver: 'ethereal'
  }
}
