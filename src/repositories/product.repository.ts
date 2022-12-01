import AppDataSource from "@/database/connection";
import CreateProductDTO from "@/dto/create.product.dto";
import { Product } from "@/entities/product.entity";
import { Repository } from "typeorm";

export class ProductRepository {
  private repository: Repository<Product>

  constructor() {
    this.repository = AppDataSource.getRepository(Product)
  }

  async getAll(): Promise<Product[]> {
    return await this.repository.find()
  }

  async create(input: CreateProductDTO): Promise<Product> {
    const product = new Product
    product.name = input.name
    product.description = input.description
    product.weight = input.weight

    return await this.repository.save(product)
  }
}
