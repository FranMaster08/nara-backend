import { MigrationInterface, QueryRunner } from "typeorm";

export class UserIdEnPedidos1755886819232 implements MigrationInterface {
    name = 'UserIdEnPedidos1755886819232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP CONSTRAINT "FK_eace73d764c798d99fd8cb2d59d"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_operador"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
                RENAME COLUMN "userId" TO "user_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_operador" ON "pedidos" ("user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD CONSTRAINT "FK_36aed28c6a9f5a965a9b2c1972f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP CONSTRAINT "FK_36aed28c6a9f5a965a9b2c1972f"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_operador"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
                RENAME COLUMN "user_id" TO "userId"
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_operador" ON "pedidos" ("userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD CONSTRAINT "FK_eace73d764c798d99fd8cb2d59d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
