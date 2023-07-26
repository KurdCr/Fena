import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const mysqlConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'db',
  // port: 3307,
  username: 'root',
  password: 'password',
  database: 'fena',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true, // Set to false in production to disable auto-schema synchronization
};

export default mysqlConfig;
