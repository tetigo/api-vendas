import { getCustomRepository } from "typeorm"
import Product from "../typeorm/entities/product"
import { ProductRepository } from "../typeorm/repositories/ProductsRepository"

interface IRequest{
    id: string,
    name: string,
    price: number,
    quantity: number
}

class UpdateProductService{
    public async execute({id, name, price, quantity}: IRequest): Promise<Product>{
        const productRepository = getCustomRepository(ProductRepository)
        const product = await productRepository.findOne(id)
        product.name = name,
        product.price=price,
        product.quantity=quantity
        return product
    }
}
export default UpdateProductService