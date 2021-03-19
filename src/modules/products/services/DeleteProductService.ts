import RedisCache from "@shared/cache/redisCache"
import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import { ProductsRepository } from "../typeorm/repositories/ProductsRepository"

interface IRequest {
  id: string
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductsRepository)
    const product = await productsRepository.findOne(id)
    if (!product) {
      throw new AppError('Product Not Found.')
    }

    const redisCache = new RedisCache()
    await redisCache.invalidate('api-vendas-PRODUCT-LIST')

    await productsRepository.delete(id)
  }
}
export default DeleteProductService
