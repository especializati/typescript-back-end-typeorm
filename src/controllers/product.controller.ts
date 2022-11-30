import {Request, response, Response} from 'express'
import { Product } from '../entities/product.entity'
import AppDataSource from '../connection'
import { Repository } from 'typeorm'

class ProductController {
  private productRepository: Repository<Product>

  constructor() {
    this.productRepository = AppDataSource.getRepository(Product)
  }
  async findAll(request: Request, response: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product)

    const products = await productRepository.find()

    return response.status(200).send({
      data: products
    })
  }

  async create(request: Request, response: Response): Promise<Response> {
    const {name, description, weight} = request.body

    const productRepository = AppDataSource.getRepository(Product)

    const product = new Product
    product.name = name
    product.weight = weight
    product.description = description
    const productDb = await productRepository.save(product)

    return response.status(201).send({
      data: productDb
    })
  }
}

export default new ProductController
