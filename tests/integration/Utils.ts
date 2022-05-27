import { Server } from '../../src/controllers/Server';
import {getConnection} from 'typeorm';

export default class Utils {
    public static async clearDatabase() {
        const connection = getConnection();
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

    public static getApp() {
        return new Server(true).getExpress();
    }
}
