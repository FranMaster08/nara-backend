import { MigrationInterface, QueryRunner } from "typeorm";

export class CorreccionTime1755949026355 implements MigrationInterface {
    name = 'CorreccionTime1755949026355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" text NOT NULL DEFAULT 'NOW'
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" text NOT NULL DEFAULT 'NOW'
        `);
    }

}
