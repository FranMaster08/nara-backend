import { MigrationInterface, QueryRunner } from "typeorm";

export class Puntosdeventasylogica1755271725719 implements MigrationInterface {
    name = 'Puntosdeventasylogica1755271725719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "CHK_cce0243fe7fc57c95cba43149f"
        `);
        await queryRunner.query(`
            CREATE TABLE "operador_pdv" (
                "operador_id" text NOT NULL,
                "punto_venta_id" text NOT NULL,
                "assigned_at" text NOT NULL DEFAULT 'NOW',
                "enabled" boolean NOT NULL,
                "operadorId" text,
                "puntoVentaId" text,
                CONSTRAINT "PK_b7e5bd5063a872c66a958b8545f" PRIMARY KEY ("operador_id", "punto_venta_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "puntos_de_venta" (
                "id" text NOT NULL,
                "name" text NOT NULL,
                "address" text NOT NULL,
                "phone" text NOT NULL,
                "lat" text NOT NULL,
                "lng" text NOT NULL,
                "status" boolean NOT NULL DEFAULT true,
                "created_at" text NOT NULL DEFAULT 'NOW',
                "updated_at" text NOT NULL DEFAULT 'NOW',
                CONSTRAINT "PK_1263f28dd23443e74b3be7f7ab7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "pedidos" (
                "id" text NOT NULL,
                "codigo" text NOT NULL,
                "estado" text NOT NULL,
                "notas" text,
                "status" boolean NOT NULL DEFAULT true,
                "created_at" text NOT NULL DEFAULT 'NOW',
                "updated_at" text NOT NULL DEFAULT 'NOW',
                "create_by" text NOT NULL,
                "userId" text,
                "puntoVentaId" text,
                CONSTRAINT "PK_ebb5680ed29a24efdc586846725" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_created_at" ON "pedidos" ("created_at")
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_estado" ON "pedidos" ("estado")
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_pdv" ON "pedidos" ("puntoVentaId")
        `);
        await queryRunner.query(`
            CREATE INDEX "pedidos_idx_pedidos_operador" ON "pedidos" ("userId")
        `);
        await queryRunner.query(`
            CREATE TABLE "lineas_pedido" (
                "id" text NOT NULL,
                "cantidad" integer NOT NULL,
                "precio_unitario_snapshot" numeric,
                "subtotal_snapshot" numeric,
                "pedidoId" text,
                "productoId" text,
                CONSTRAINT "PK_16d970b5545c248900ab07a70e8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "lineas_pedido_idx_lineas_pedido_pedido" ON "lineas_pedido" ("pedidoId")
        `);
        await queryRunner.query(`
            CREATE TABLE "productos" (
                "id" text NOT NULL,
                "nombre" text NOT NULL,
                "precio_unitario" numeric NOT NULL,
                "sku" text,
                "status" boolean NOT NULL DEFAULT true,
                "created_at" text NOT NULL DEFAULT 'NOW',
                "updated_at" text NOT NULL DEFAULT 'NOW',
                CONSTRAINT "PK_04f604609a0949a7f3b43400766" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_805687bf24c1411756fbd37b2f" ON "productos" ("sku")
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "isActive"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "birth_date"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "documentTypeId"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "documentNumber"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "passwordHash"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "cellphone"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "password_hash" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "birthDate" date NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "phone" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "status" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "id" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "name"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "name" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "lastName"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "lastName" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "address"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "address" text NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "role" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" text NOT NULL DEFAULT 'NOW'
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" text NOT NULL DEFAULT 'NOW'
        `);
        await queryRunner.query(`
            ALTER TABLE "operador_pdv"
            ADD CONSTRAINT "FK_ef918124544b84934380b458d80" FOREIGN KEY ("operadorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "operador_pdv"
            ADD CONSTRAINT "FK_3c67a87a3fa1f3e2f5ef5c2b4de" FOREIGN KEY ("puntoVentaId") REFERENCES "puntos_de_venta"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD CONSTRAINT "FK_eace73d764c798d99fd8cb2d59d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos"
            ADD CONSTRAINT "FK_f03df5d3dd8bb7d59bc46190a7e" FOREIGN KEY ("puntoVentaId") REFERENCES "puntos_de_venta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "lineas_pedido"
            ADD CONSTRAINT "FK_771c31b07accb08eb02bd87eb47" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "lineas_pedido" DROP CONSTRAINT "FK_771c31b07accb08eb02bd87eb47"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP CONSTRAINT "FK_f03df5d3dd8bb7d59bc46190a7e"
        `);
        await queryRunner.query(`
            ALTER TABLE "pedidos" DROP CONSTRAINT "FK_eace73d764c798d99fd8cb2d59d"
        `);
        await queryRunner.query(`
            ALTER TABLE "operador_pdv" DROP CONSTRAINT "FK_3c67a87a3fa1f3e2f5ef5c2b4de"
        `);
        await queryRunner.query(`
            ALTER TABLE "operador_pdv" DROP CONSTRAINT "FK_ef918124544b84934380b458d80"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "created_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "address"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "address" character varying(160) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "email"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "email" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "lastName"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "lastName" character varying(100)
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "name"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "name" character varying(100) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "phone"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "birthDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "password_hash"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "cellphone" character varying(32) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "passwordHash" character varying(72) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "documentNumber" character varying(32) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "documentTypeId" integer NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "birth_date" date
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "isActive" boolean NOT NULL DEFAULT true
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_805687bf24c1411756fbd37b2f"
        `);
        await queryRunner.query(`
            DROP TABLE "productos"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."lineas_pedido_idx_lineas_pedido_pedido"
        `);
        await queryRunner.query(`
            DROP TABLE "lineas_pedido"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_operador"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_pdv"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_estado"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."pedidos_idx_pedidos_created_at"
        `);
        await queryRunner.query(`
            DROP TABLE "pedidos"
        `);
        await queryRunner.query(`
            DROP TABLE "puntos_de_venta"
        `);
        await queryRunner.query(`
            DROP TABLE "operador_pdv"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "CHK_cce0243fe7fc57c95cba43149f" CHECK (
                    (
                        (birth_date IS NULL)
                        OR (birth_date <= CURRENT_DATE)
                    )
                )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")
        `);
    }

}
