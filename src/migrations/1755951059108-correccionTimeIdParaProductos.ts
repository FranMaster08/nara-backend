import { MigrationInterface, QueryRunner } from "typeorm";

export class CorreccionTimeIdParaProductos1755951059108 implements MigrationInterface {
    name = 'CorreccionTimeIdParaProductos1755951059108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "productos" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "productos" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "productos" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos"
            ADD "updated_at" text NOT NULL DEFAULT 'NOW'
        `);
        await queryRunner.query(`
            ALTER TABLE "productos" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "productos"
            ADD "created_at" text NOT NULL DEFAULT 'NOW'
        `);
    }

}
