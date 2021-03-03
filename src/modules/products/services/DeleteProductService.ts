import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import { ProductsRepository } from "../typeorm/repositories/ProductsRepository"

interface IRequest {
  id: string
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductsRepository)
    const product = productsRepository.findOne(id)
    if (!product) {
      throw new AppError('Product Not Found.')
    }
    await productsRepository.delete(id)
  }
}
export default DeleteProductService
