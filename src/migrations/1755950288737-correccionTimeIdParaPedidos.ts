import { MigrationInterface, QueryRunner } from "typeorm";

export class CorreccionTimeIdParaPedidos1755950288737 implements MigrationInterface {
    name = 'CorreccionTimeIdParaPedidos1755950288737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP CONSTRAINT "FK_88129adeda1248623158c595494"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos" DROP CONSTRAINT "PK_04f604609a0949a7f3b43400766"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "productos"
            ADD CONSTRAINT "PK_04f604609a0949a7f3b43400766" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP COLUMN "productoId"
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD "productoId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD CONSTRAINT "FK_88129adeda1248623158c595494" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP CONSTRAINT "FK_88129adeda1248623158c595494"
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido" DROP COLUMN "productoId"
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD "productoId" text
        `);
        await queryRunner.query(`
            ALTER TABLE "productos" DROP CONSTRAINT "PK_04f604609a0949a7f3b43400766"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos"
            ADD "id" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "productos"
            ADD CONSTRAINT "PK_04f604609a0949a7f3b43400766" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD CONSTRAINT "FK_88129adeda1248623158c595494" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
