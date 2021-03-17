import Customer from "@modules/customers/typeorm/entities/Customer"
import CustomersRepository from "@modules/customers/typeorm/repositories/CustomersRepository"
import Product from "@modules/products/typeorm/entities/product"
import { ProductsRepository } from "@modules/products/typeorm/repositories/ProductsRepository"
import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import Order from "../typeorm/entities/Order"
import OrdersRepository from "../typeorm/repositories/OrdersRepository"

// interface IFindProducts{
//     product_id: string
//   }

interface IProduct {
    product_id: string,
    quantity: number,
    price: number
}

interface IProductUpdate {
    id: string,
    quantity: number,
}

interface IRequest {
    customer_id: string,
    products: IProduct[]
}


class CreateOrderService {
    public async execute({ customer_id, products }: IRequest): Promise<Order> {
        const ordersRepository = getCustomRepository(OrdersRepository)
        const customerRepository = getCustomRepository(CustomersRepository)
        const productsRepository = getCustomRepository(ProductsRepository)

        const customer = await customerRepository.findById(customer_id)
        if (!customer) {
            throw new AppError('Customer not found')
        }

        //retorna todos os IDs que foram encontrados no banco
        const existsProducts = await productsRepository.findAllByIds(products.map(p => p.product_id))
        if (existsProducts.length === 0) {
            throw new AppError('Products not found with the given IDs')
        }
        const existsProductsIds = existsProducts.map(prod => prod.id)
        const checkInexistentProducts = products.filter(prod => !existsProductsIds.includes(prod.product_id))
        if (checkInexistentProducts.length > 0) {
            throw new AppError(`Products IDs not found: [${checkInexistentProducts.map(p => p.product_id)}]`)
        }
        const insuficientQuantity: Product[] = []
        products.forEach(prod => {
            const foundProd = existsProducts.filter(p => p.id === prod.product_id)[0]
            if (foundProd.quantity < prod.quantity) insuficientQuantity.push(foundProd)
        })
        if (insuficientQuantity.length > 0) {
            throw new AppError(`Products quantity not available: [${insuficientQuantity.map(p => p.id)}]`)
        }
        const serializedProducts: IProduct[] = existsProducts.map(prod => {
            return {
                product_id: prod.id,
                quantity: products.filter(p => p.product_id === prod.id)[0].quantity,
                price: prod.price
            }
        })
        const order = await ordersRepository.createOrder({ customer, products: serializedProducts })

        //atualizar estoque dos produtos comprados
        const updateProductQuantity: IProductUpdate[] = existsProducts.map(prod => {
            return {
                id: prod.id,
                quantity: prod.quantity - products.filter(p => p.product_id === prod.id)[0].quantity,
            }
        })
        await productsRepository.save(updateProductQuantity)

        return order
    }
}
export default CreateOrderService