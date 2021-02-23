import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
