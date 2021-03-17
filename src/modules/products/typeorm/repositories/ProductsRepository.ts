import { EntityRepository, In, Repository } from "typeorm"
import Product from '../entities/product'

@EntityRepository(Product)
export class ProductsRepository extends Repository<Product>{

  public async findByName(name: string): Promise<Product | undefined>{
    const product = await this.findOne({where: {name}})
    return product
  }
  public async findAllByIds(products: string[]): Promise<Product[]>{
    //retorna todos os que foram encontrados
    const existsProducts = await this.find({where:{id: In(products)}})
    return existsProducts
  }
}
