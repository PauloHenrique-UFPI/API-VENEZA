import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1721315103525 implements MigrationInterface {
    name = 'Default1721315103525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "cep"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "endereco"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "tipo"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "nome" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."usuarios_usuariotipo_enum" AS ENUM('user', 'admin', 'atendente')`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "usuarioTipo" "public"."usuarios_usuariotipo_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "usuarioTipo"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_usuariotipo_enum"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "nome"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "tipo" character varying`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "endereco" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "cep" character varying NOT NULL`);
    }

}
