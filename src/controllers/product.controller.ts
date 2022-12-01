import {Request, response, Response} from 'express'
import { Product } from '@/entities/product.entity'
import AppDataSource from '@/database/connection'
import { validate } from 'class-validator'
import { ProductRepository } from '@/repositories/product.repository'

class ProductController {
  private productRepository: ProductRepository

  constructor() {
    this.productRepository = new ProductRepository
  }

  findAll = async (request: Request, response: Response): Promise<Response> => {
    const products = await this.productRepository.getAll()

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

    const errors = await validate(product)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    const productDb = await productRepository.save(product)

    return response.status(201).send({
      data: productDb
    })
  }

  async findOne(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id

    const productRepository = AppDataSource.getRepository(Product)
    const product = await productRepository.findOneBy({ id })

    if (!product) {
      return response.status(404).send({
        error: 'Product not found'
      })
    }

    return response.status(200).send({
      data: product
    })
  }

  async update(request: Request, response: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product)

    const id: string = request.params.id
    const {name, description, weight} = request.body

    let product
    try {
      product = await productRepository.findOneByOrFail({ id })
    } catch (error) {
      return response.status(404).send({
        error: 'Product Not Found'
      })
    }

    product.name = name
    product.description = description
    product.weight = weight

    const errors = await validate(product)
    if (errors.length > 0) {
      return response.status(422).send({
        errors
      })
    }

    try {
      const productDb = await productRepository.save(product)
      return response.status(200).send({
        data: productDb
      })
    } catch (error) {
      return response.status(500).send({
        error: 'Internal error'
      })
    }
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const id: string = request.params.id

    const productRepository = AppDataSource.getRepository(Product)
    try {
      await productRepository.delete(id)

      return response.status(204).send({})
    } catch (error) {
      return response.status(400).send({
        error: 'Error deleting'
      })
    }
  }
}

export default new ProductController
