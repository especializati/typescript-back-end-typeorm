import {Request, response, Response} from 'express'
import { Product } from '@/entities/product.entity'
import AppDataSource from '@/database/connection'
import { validate } from 'class-validator'
import { ProductRepository } from '@/repositories/product.repository'
import { CreateProductDTO } from '@/dto/create.product.dto'

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

  create = async (request: Request, response: Response): Promise<Response> => {
    const {name, description, weight} = request.body

    const createProductDTO = new CreateProductDTO
    createProductDTO.name = name
    createProductDTO.description = description
    createProductDTO.weight = weight

    const errors = await validate(createProductDTO)
    if (errors.length > 0) {
      return response.status(422).send({
        error: errors
      })
    }

    const productDb = await this.productRepository.create(createProductDTO)

    return response.status(201).send({
      data: productDb
    })
  }

  findOne = async (request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id

    const product = await this.productRepository.find(id)
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

  delete = async (request: Request, response: Response): Promise<Response> => {
    const id: string = request.params.id

    try {
      await this.productRepository.delete(id)

      return response.status(204).send({})
    } catch (error) {
      return response.status(400).send({
        error: 'Error deleting'
      })
    }
  }
}

export default new ProductController
