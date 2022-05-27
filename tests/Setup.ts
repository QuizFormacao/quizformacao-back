import 'reflect-metadata';
// @ts-ignore
import Dotenv from 'dotenv';
import {createConnection, getConnection, ConnectionOptions} from 'typeorm';
import * as jest from 'jest';
import Utils from './integration/Utils';

Dotenv.config();

const databaseConfig: ConnectionOptions = {
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT || '8102'),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE_TEST,
    entities: ['src/entity/**/*.ts'],
    logging: true,
    synchronize: true,
};

createConnection(databaseConfig)
    .then(() => jest.run())
    .then(Utils.clearDatabase)
    .then(getConnection().close)
    .catch((e) => console.error(e))
;
