// api/content.ts
import { Request, Response } from '@adonisjs/core/build/standalone'
import ContentController from 'App/Controllers/Http/ContentController'

export default async (req: Request, res: Response) => {
  const contentController = new ContentController()

  switch (req.method) {
    case 'GET':
      return await contentController.index(req, res)
    case 'POST':
      return await contentController.store(req, res)
    case 'PUT':
      return await contentController.update(req, res)
    case 'DELETE':
      return await contentController.destroy(req, res)
    default:
      res.status(405).json({ error: 'Method Not Allowed' })
  }
}
