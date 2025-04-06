// api/index.ts
import { Request, Response } from '@adonisjs/core/build/standalone'

export default async (req: Request, res: Response) => {
  return res.json({ greeting: 'Hello world in JSON' })
}
