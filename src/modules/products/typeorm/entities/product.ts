import OrdersProducts from "@modules/orders/typeorm/entities/OrdersProducts";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//pra funcionar precisar habilitar algumas flags no tsconfig.json
// "strictPropertyInitialization": false,  /* Enable strict checking of property initialization in classes. */
// "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
// "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

@Entity('products')
class Product{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(()=>OrdersProducts, order_products=>order_products.product)
  order_products: OrdersProducts[]

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
