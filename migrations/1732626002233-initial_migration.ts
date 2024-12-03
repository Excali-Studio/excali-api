import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732626002233 implements MigrationInterface {
    name = 'InitialMigration1732626002233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "canvas_tag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "color" character varying(7), "description" character varying(1024), CONSTRAINT "UQ_dae20ed57768d3f73e575482252" UNIQUE ("name"), CONSTRAINT "UQ_dae20ed57768d3f73e575482252" UNIQUE ("name"), CONSTRAINT "PK_429116562ec9ac8dee9c869a8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_role" ("name" character varying NOT NULL, CONSTRAINT "UQ_31f96f2013b7ac833d7682bf021" UNIQUE ("name"), CONSTRAINT "PK_31f96f2013b7ac833d7682bf021" PRIMARY KEY ("name"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "displayName" character varying NOT NULL, "isEnabled" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "canvas_access" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isOwner" boolean NOT NULL DEFAULT false, "canvasId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_2f4498894baaca69c38a094fc68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "canvas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "dateUpdated" TIMESTAMP NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0f87c183b39aec0e115707e10a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "canvas_state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appState" jsonb NOT NULL DEFAULT '{}', "elements" jsonb NOT NULL DEFAULT '{}', "files" jsonb NOT NULL DEFAULT '{}', "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), "canvasId" uuid NOT NULL, CONSTRAINT "PK_73e242d65e271e2e506aaa67feb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("userId" uuid NOT NULL, "userRoleName" character varying NOT NULL, CONSTRAINT "PK_5b9b5cd6122add049b8bebe9a1d" PRIMARY KEY ("userId", "userRoleName"))`);
        await queryRunner.query(`CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_97bd8819dde9c827121ac3ade5" ON "user_roles" ("userRoleName") `);
        await queryRunner.query(`CREATE TABLE "canvas_tags" ("canvasId" uuid NOT NULL, "canvasTagId" uuid NOT NULL, CONSTRAINT "PK_3397911823bcd30b3f7af6aa0a1" PRIMARY KEY ("canvasId", "canvasTagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bf9024c43eff5ab42b282d78d0" ON "canvas_tags" ("canvasId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84f0f78a44dcafdbd4fa4eb380" ON "canvas_tags" ("canvasTagId") `);
        await queryRunner.query(`ALTER TABLE "canvas_access" ADD CONSTRAINT "FK_a493b634508ee1173e9507c6b2e" FOREIGN KEY ("canvasId") REFERENCES "canvas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "canvas_access" ADD CONSTRAINT "FK_7c38522a5a09624a8321c2dbe08" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "canvas_state" ADD CONSTRAINT "FK_c8eee0b14b62b162f2f5aec8f40" FOREIGN KEY ("canvasId") REFERENCES "canvas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_97bd8819dde9c827121ac3ade55" FOREIGN KEY ("userRoleName") REFERENCES "user_role"("name") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "canvas_tags" ADD CONSTRAINT "FK_bf9024c43eff5ab42b282d78d09" FOREIGN KEY ("canvasId") REFERENCES "canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "canvas_tags" ADD CONSTRAINT "FK_84f0f78a44dcafdbd4fa4eb3802" FOREIGN KEY ("canvasTagId") REFERENCES "canvas_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "canvas_tags" DROP CONSTRAINT "FK_84f0f78a44dcafdbd4fa4eb3802"`);
        await queryRunner.query(`ALTER TABLE "canvas_tags" DROP CONSTRAINT "FK_bf9024c43eff5ab42b282d78d09"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_97bd8819dde9c827121ac3ade55"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "canvas_state" DROP CONSTRAINT "FK_c8eee0b14b62b162f2f5aec8f40"`);
        await queryRunner.query(`ALTER TABLE "canvas_access" DROP CONSTRAINT "FK_7c38522a5a09624a8321c2dbe08"`);
        await queryRunner.query(`ALTER TABLE "canvas_access" DROP CONSTRAINT "FK_a493b634508ee1173e9507c6b2e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_84f0f78a44dcafdbd4fa4eb380"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bf9024c43eff5ab42b282d78d0"`);
        await queryRunner.query(`DROP TABLE "canvas_tags"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97bd8819dde9c827121ac3ade5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_472b25323af01488f1f66a06b6"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "canvas_state"`);
        await queryRunner.query(`DROP TABLE "canvas"`);
        await queryRunner.query(`DROP TABLE "canvas_access"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_role"`);
        await queryRunner.query(`DROP TABLE "canvas_tag"`);
    }

}
