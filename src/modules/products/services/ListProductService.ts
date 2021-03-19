import { getCustomRepository } from "typeorm"
import Product from "../typeorm/entities/product"
import { ProductsRepository } from "../typeorm/repositories/ProductsRepository"
import RedisCache from "@shared/cache/redisCache";

class ListProductService{
  public async execute(): Promise<Product[]>{
    const productsRepository = getCustomRepository(ProductsRepository)
    const redisCache = new RedisCache()

    let products = await redisCache.recover<Product[]>('api-vendas-PRODUCT-LIST')

    if(!products){
      products = await productsRepository.find()
      await redisCache.save('api-vendas-PRODUCT-LIST', products)
    } 

    return products
  }
}
export default ListProductService
