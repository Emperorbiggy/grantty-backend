// app/Controllers/Http/ContentController.js

'use strict'

const Content = use('App/Models/Content')

class ContentController {
  async store ({ request, response }) {
    const data = request.only(['title', 'text'])
    
    // Create the new content record in the database
    const content = await Content.create(data)

    // Return the created content as a JSON response
    return response.status(201).json(content)
  }
  async index ({ response }) {
    const contents = await Content.all()
    return response.json(contents)
  }
  async update ({ params, request, response }) {
    const content = await Content.find(params.id)
    if (!content) {
      return response.status(404).json({ message: 'Content not found' })
    }
  
    const { title, text } = request.only(['title', 'text'])
    content.title = title
    content.text = text
    await content.save()
  
    return response.json(content)
  }
  async destroy ({ params, response }) {
    const content = await Content.find(params.id)
    if (!content) {
      return response.status(404).json({ message: 'Content not found' })
    }
  
    await content.delete()
  
    return response.status(200).json({ message: 'Content deleted successfully' })
  }
  
}

module.exports = ContentController
