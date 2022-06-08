import Server from './../../src/Server';
import {Connection, ConnectionOptions, createConnection, getConnection} from 'typeorm';
import * as Dotenv from 'dotenv';

Dotenv.config({path: '.env.development'});

export default class Utils {
    private static connection: Connection|null = null;

    private static readonly databaseConfig: ConnectionOptions = {
        type: 'mysql',
        host: process.env.TYPEORM_HOST,
        port: Number(process.env.TYPEORM_PORT || '3306'),
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        entities: ['src/entity/**/*.ts'],
        logging: true,
        synchronize: true,
    };

    public static async getConnection(): Promise<Connection> {
        if (this.connection === null) {
            const connection = await createConnection(this.databaseConfig);
            this.connection = connection;
            return connection;
        }
        return this.connection;
    }

    public static async clearDatabase() {
        const connection = await this.getConnection();
        const entities = connection.entityMetadatas;

        for (const entity of entities) {
            const repository = connection.getRepository(entity.name); // Get repository
            try {
                await repository.query(`DELETE FROM ${ entity.tableName }`);
                await repository.clear();
            } catch (e: any) {
                console.log(e.message);
            }
        }
    }

    public static async getApp() {
        await this.getConnection();
        return new Server(true).getExpress();
    }
}
