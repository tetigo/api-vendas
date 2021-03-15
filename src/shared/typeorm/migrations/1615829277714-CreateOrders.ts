import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateOrders1615829277714 implements MigrationInterface {

    //essa migracao tem somente esses campos para adicionar os demais
    //fazendo uso de nova migracao, somente para treinar outro tipo de migration 
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "orders",
            columns:[
                {
                    name: "id",
                    type: "uuid",
                    generationStrategy: "uuid",
                    isPrimary: true,
                    default: "uuid_generate_v4()"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
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
        await queryRunner.dropTable('orders')
    }

}
