import Dotenv from "dotenv"
import {createConnection, getConnection} from "typeorm"
import {Server} from "../../src/controllers/Server"

export default class Utils{
    public static async connectDatabase() {
        Dotenv.config()
        process.env.TYPEORM_DATABASE = process.env.TEST_DATABASE
        process.env.TYPEORM_ENTITIES = (process.env.TYPEORM_ENTITIES || "build/src/entity/**/*.js")
                                            .replace('*.js', '*.ts')
                                            .replace('build/', '')

        try{
            await createConnection()
        }catch (e: any) {
            console.log(e.message)
        }
    }

    public static async closeConnection() {
        Dotenv.config()

        try {
            await getConnection().close()
        }catch (e: any){
            console.log(e.message)
        }

        process.env.TYPEORM_DATABASE = process.env.COMMUNICATION_DATABASE
        process.env.TYPEORM_ENTITIES = 'build/'+(process.env.TYPEORM_ENTITIES || "src/entity/**/*.ts")
                                            .replace('*.ts', '*.js')
    }

    public static async clearDatabase() {
        const connection = getConnection()
        const entities = connection.entityMetadatas

        for (const entity of entities) {
            const repository = connection.getRepository(entity.name) // Get repository
            try {
                await repository.query(`DELETE FROM ${entity.tableName}`);
                await repository.clear()
            }catch (e: any){
                console.log(e.message)
            }
        }
    }

    public static getApp(){
        return new Server(true).getExpress()
    }
}