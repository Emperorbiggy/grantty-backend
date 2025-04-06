'use strict'

const Content = use('App/Models/Content');
const axios = require('axios');

class ChatbotController {
  async store ({ request, response }) {
    const { message } = request.only(['message']);

    try {
      // Check if content exists in the database
      const content = await Content.query()
        .where('title', 'LIKE', `%${message}%`)
        .orWhere('text', 'LIKE', `%${message}%`)
        .first();

      if (content) {
        return response.json({ response: content.text });
      }

      // Call AIML API directly
      const aimlResponse = await axios.post(
        'https://api.aimlapi.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          stream: false
        },
        {
          headers: {
            'Authorization': 'Bearer 5107c2ab23ba4e1b8090f6bd1c0c5ff2',
            'Content-Type': 'application/json'
          }
        }
      );

      const answer = aimlResponse.data.choices[0].message.content;

      return response.json({ response: answer });

    } catch (error) {
      console.error('AIML API Error:', error.response ? error.response.data : error.message);
      return response.status(500).json({ error: 'Sorry, I could not generate a response at this time.' });
    }
  }
}

module.exports = ChatbotController;
