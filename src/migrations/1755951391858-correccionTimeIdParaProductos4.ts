import { MigrationInterface, QueryRunner } from "typeorm";

export class CorreccionTimeIdParaProductos41755951391858 implements MigrationInterface {
    name = 'CorreccionTimeIdParaProductos41755951391858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "operador_pdv"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "operador_pdv"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "puntos_de_venta" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "puntos_de_venta"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "puntos_de_venta" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "puntos_de_venta"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_created_at" ON "pedidos" ("created_at")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD "updated_at" text NOT NULL DEFAULT 'NOW'
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD "created_at" text NOT NULL DEFAULT 'NOW'
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_created_at" ON "pedidos" ("created_at")
        `);
        await queryRunner.query(`
            ALTER TABLE "puntos_de_venta" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "puntos_de_venta"
            ADD "updated_at" text NOT NULL DEFAULT 'NOW'
        `);
        await queryRunner.query(`
            ALTER TABLE "puntos_de_venta" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "puntos_de_venta"
            ADD "created_at" text NOT NULL DEFAULT 'NOW'
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "operador_pdv" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "operador_pdv" DROP COLUMN "created_at"
        `);
    }

}
