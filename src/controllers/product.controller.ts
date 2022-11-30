import {Request, Response} from 'express'

class ProductController {
  findAll(request: Request, response: Response): Response {
    return response.status(200).send({
      data: []
    })
  }
}

export default new ProductController
