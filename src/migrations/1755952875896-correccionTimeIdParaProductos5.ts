import { MigrationInterface, QueryRunner } from "typeorm";

export class CorreccionTimeIdParaProductos51755952875896 implements MigrationInterface {
    name = 'CorreccionTimeIdParaProductos51755952875896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP CONSTRAINT "FK_771c31b07accb08eb02bd87eb47"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."lineas_pedido_idx_lineas_pedido_pedido"
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP COLUMN "pedidoId"
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD "pedidoId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP CONSTRAINT "PK_ebb5680ed29a24efdc586846725"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD CONSTRAINT "PK_ebb5680ed29a24efdc586846725" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            CREATE INDEX "lineas_pedido_idx_lineas_pedido_pedido" ON "lineas_pedido" ("pedidoId")
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD CONSTRAINT "FK_771c31b07accb08eb02bd87eb47" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP CONSTRAINT "FK_771c31b07accb08eb02bd87eb47"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."lineas_pedido_idx_lineas_pedido_pedido"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP CONSTRAINT "PK_ebb5680ed29a24efdc586846725"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD "id" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD CONSTRAINT "PK_ebb5680ed29a24efdc586846725" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP COLUMN "pedidoId"
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD "pedidoId" text
        `);
        await queryRunner.query(`
            CREATE INDEX "lineas_pedido_idx_lineas_pedido_pedido" ON "lineas_pedido" ("pedidoId")
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD CONSTRAINT "FK_771c31b07accb08eb02bd87eb47" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
