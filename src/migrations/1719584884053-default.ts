import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1719584884053 implements MigrationInterface {
    name = 'Default1719584884053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promocao" ADD "bebidaId" integer`);
        await queryRunner.query(`ALTER TABLE "promocao" ADD CONSTRAINT "FK_6ebcddcb005a8719edb6ef94309" FOREIGN KEY ("bebidaId") REFERENCES "bebida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promocao" DROP CONSTRAINT "FK_6ebcddcb005a8719edb6ef94309"`);
        await queryRunner.query(`ALTER TABLE "promocao" DROP COLUMN "bebidaId"`);
    }

}
