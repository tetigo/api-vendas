import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateOrdersProducts1615831251574 implements MigrationInterface {

    //chaves estrangeira das 2 tabelas vão ser inseridas em outra migration
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "orders_products",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "price",
                    type: "decimal",
                    precision: 10,
                    scale: 2
                },
                {
                    name: "quantity",
                    type: "decimal"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('orders_products')
    }

}
