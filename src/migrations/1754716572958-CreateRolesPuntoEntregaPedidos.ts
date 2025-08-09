import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesPuntoEntregaPedidos1754716572958 implements MigrationInterface {
    name = 'CreateRolesPuntoEntregaPedidos1754716572958'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1) Asegurarse de que gen_random_uuid() esté disponible
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

        // 2) Tabla roles (SERIAL) + constraint UNIQUE para evitar duplicados
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "roles" (
                "id" SERIAL PRIMARY KEY,
                "nombre" VARCHAR(100) NOT NULL,
                CONSTRAINT "UQ_roles_nombre" UNIQUE ("nombre")
            );
        `);

        // Insertar roles iniciales (no duplica si ya existen)
        await queryRunner.query(`
            INSERT INTO "roles" (nombre) VALUES
            ('Admin'),
            ('Jefe de Operaciones'),
            ('Operador'),
            ('Beneficiario')
            ON CONFLICT ("nombre") DO NOTHING;
        `);

        // 3) Tabla punto_entrega (UUID)
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "punto_entrega" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "nombre" VARCHAR(200) NOT NULL,
                "direccion" TEXT NOT NULL,
                "latitud" DOUBLE PRECISION,
                "longitud" DOUBLE PRECISION,
                "activo" BOOLEAN NOT NULL DEFAULT true,
                CONSTRAINT "PK_punto_entrega" PRIMARY KEY ("id")
            );
        `);

        // 4) Crear tipo ENUM para pedidos.estado si no existe
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pedidos_estado_enum') THEN
                    CREATE TYPE "public"."pedidos_estado_enum" AS ENUM('pendiente','en_proceso','entregado','cancelado');
                END IF;
            END
            $$;
        `);

        // 5) Tabla pedidos (UUID) con todos los campos solicitados
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "pedidos" (
                "id" UUID NOT NULL DEFAULT gen_random_uuid(),
                "beneficiario_id" UUID NOT NULL,
                "fecha_solicitud" TIMESTAMP NOT NULL DEFAULT now(),
                "estado" "public"."pedidos_estado_enum" NOT NULL DEFAULT 'pendiente',
                "comprobante_archivo" VARCHAR,
                "latitud_entrega" DOUBLE PRECISION,
                "longitud_entrega" DOUBLE PRECISION,
                "fecha_entrega" TIMESTAMP,
                "observaciones" TEXT,
                CONSTRAINT "PK_pedidos" PRIMARY KEY ("id")
            );
        `);

        // 6) Agregar FK a "beneficiarios" SI la tabla existe (para evitar fallo si no está creada aún)
        const hasBeneficiarios = await queryRunner.hasTable('beneficiarios');
        if (hasBeneficiarios) {
            await queryRunner.query(`
                ALTER TABLE "pedidos"
                ADD CONSTRAINT "FK_pedidos_beneficiario"
                FOREIGN KEY ("beneficiario_id") REFERENCES "beneficiarios"("id") ON DELETE CASCADE;
            `);
        } else {
            // Si no existe, dejamos la columna y se deberá crear la FK en una migración posterior
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Quitar FK si existe y dropear tablas/tipo en orden seguro
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT IF EXISTS "FK_pedidos_beneficiario";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "pedidos";`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."pedidos_estado_enum";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "punto_entrega";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "roles";`);
    }
}
