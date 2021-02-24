import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/product";
import { ProductsRepository } from "../typeorm/repositories/ProductsRepository";

interface IRequest{
  id: string
}

export default class ShowProductService{
  public async execute({id}:IRequest) : Promise<Product | undefined>{
    const productsRepository = getCustomRepository(ProductsRepository)
    const product = await productsRepository.findOne(id)
    if(!product){
      throw new AppError('Product Not Found.')
    }
    return product
  }

}
