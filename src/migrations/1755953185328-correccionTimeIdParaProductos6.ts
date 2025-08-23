import { MigrationInterface, QueryRunner } from "typeorm";

export class CorreccionTimeIdParaProductos61755953185328 implements MigrationInterface {
    name = 'CorreccionTimeIdParaProductos61755953185328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP CONSTRAINT "FK_f03df5d3dd8bb7d59bc46190a7e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_pdv"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
                RENAME COLUMN "puntoVentaId" TO "punto_venta_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ALTER COLUMN "punto_venta_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_pdv" ON "pedidos" ("punto_venta_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD CONSTRAINT "FK_5586204c963a336874a9b35f32e" FOREIGN KEY ("punto_venta_id") REFERENCES "puntos_de_venta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP CONSTRAINT "FK_5586204c963a336874a9b35f32e"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_pdv"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ALTER COLUMN "punto_venta_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
                RENAME COLUMN "punto_venta_id" TO "puntoVentaId"
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_pdv" ON "pedidos" ("puntoVentaId")
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD CONSTRAINT "FK_f03df5d3dd8bb7d59bc46190a7e" FOREIGN KEY ("puntoVentaId") REFERENCES "puntos_de_venta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
