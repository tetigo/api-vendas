import Customer from "@modules/customers/typeorm/entities/Customer";
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import OrdersProducts from "./OrdersProducts";



//olhando para o nome da classe da entidade (Order).
//Pode-se ter muitas dela @ManyToOne( para um Cliente ()=> Customer)
//usando a Foreign Key @JoinColumn "customer_id" para o relacionamento

@Entity('orders')
class Order{
    @PrimaryGeneratedColumn('uuid')
    id: string

    //um cliente pode ter muitos pedidos
    //muitas orders para um customer
    @ManyToOne(()=>Customer)
    //a foreign key
    @JoinColumn({
        name: "customer_id"
    })
    customer: Customer

    //cascade:true serve para que na hora de salvar uma order, ele já salve order_products tambem
    //na hora que der um save em orders, todos os order_products relacionados vão ser salvos automaticamente
    @OneToMany(
        ()=>OrdersProducts, 
        order_products => order_products.order,
        {cascade: true}
    )
    order_products: OrdersProducts[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}
export default Order

//poderia ter sido feito o inverso, ter colocado na tabela de cliente
//ficando @OneToMany(()=>Orders)
//a definição de onde colocar depende de onde vamos precisar usar os dados
//no cado aqui, vamos precisar pegar o Customer de dentro da Order
//por isso definido desse lado, lado da Order do relacionamento Muitos pra Um
