import {Request, Response} from 'express'
import { Product } from '../entities/product.entity'
import AppDataSource from '../connection'

class ProductController {
  async findAll(request: Request, response: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product)

    const products = await productRepository.find()

    return response.status(200).send({
      data: products
    })
  }
}

export default new ProductController
