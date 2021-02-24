import AppError from "@shared/errors/AppError";
import { id } from "date-fns/locale";
import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/product";
import { ProductsRepository } from "../typeorm/repositories/ProductsRepository";

interface IRequest {
  id: string,
  name: string,
  price: number,
  quantity: number
}

export default class UpdateProductService {
  public async execute({ id, name, price, quantity }: IRequest): Promise<Product | undefined> {
    const productsRepository = getCustomRepository(ProductsRepository)

    let product = await productsRepository.findOne(id)
    if (!product) {
      throw new AppError('Product Not Found.')
    }

    const productExists = await productsRepository.findByName(name)
    if (productExists) {
      throw new AppError('There is already one product with this name')
    }

    product.name = name
    product.price = price
    product.quantity = quantity

    await productsRepository.save(product)

    return product
  }
}
