import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const config: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  host: process.env.DATABASE_HOST || 'localhost',
  username: process.env.DATABASE_USERNAME || 'excali_studio',
  password: process.env.DATABASE_PASSWORD || 'excali_studio',
  database: process.env.DATABASE_NAME || 'excali_studio',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: 'all',
  synchronize: false,
  migrationsRun: true,
};

export const dataSource = new DataSource(config);
