import { getCustomRepository } from "typeorm"
import Product from "../typeorm/entities/product"
import { ProductsRepository } from "../typeorm/repositories/ProductsRepository"

class ListProductService{
  public async execute(): Promise<Product[]>{
    const productsRepository = getCustomRepository(ProductsRepository)
    const products = await productsRepository.find()
    return products
  }
}
export default ListProductService
