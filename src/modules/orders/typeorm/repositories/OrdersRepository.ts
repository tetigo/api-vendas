import Customer from "@modules/customers/typeorm/entities/Customer";
import { EntityRepository, Repository } from "typeorm";
import Order from "../entities/Order";

interface IProduct{
    product_id: string,
    price: number,
    quantity: number
}

interface IRequest{
    customer: Customer,
    products: IProduct[]
}

@EntityRepository(Order)
class OrdersRepository extends Repository<Order>{
    public async findById(id:string): Promise<Order | undefined>{
        const order = await this.findOne(id, {
            //'order_products' aqui em relations é o nome definido na entidade Order para relacionamento OneToMany
            //não é o nome da tabela no banco de dados, apesar do nome quase igual, senão seria: 'orders_products'
            relations: ['order_products', 'customer']
        })
        return order
    }
    public async createOrder({customer, products}:IRequest): Promise<Order>{
        const order = this.create({customer, order_products: products})
        await this.save(order)
        return order
    }
}
export default OrdersRepository