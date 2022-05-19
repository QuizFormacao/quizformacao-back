import "reflect-metadata"
import Express, {Application} from 'express'
import {createConnection} from "typeorm"
import Dotenv from 'dotenv'
import Cors from 'cors'
import Routes from './Routes'
import SwaggerUI from "swagger-ui-express"

export class Server {
    private readonly express: Application
    private readonly isTest?: boolean

    constructor(isTest?: boolean) {
        this.isTest = isTest
        Dotenv.config()
        this.express = Express()

        if (!isTest) {
            this.database()
        }
        this.middlewares()
        this.routes()
    }

    public start(): void {
        this.express.set('port', process.env.SERVER_PORT)
        this.express.listen(process.env.SERVER_PORT, () => {
            console.clear()
            console.log(`${process.env.SERVER_NAME} running on port ${process.env.SERVER_PORT}.`)
        })
    }

    private middlewares(): void {
        /* Preparing middleware to parse different data formats */
        this.express.use(Express.json())
        this.express.use(Express.urlencoded({ extended: true, }))
        /* Setup CORS, adding this options to all response headers. */
        this.express.use(Cors())
    }

    /* connect db. see .env for typeorm config */
    private database(): void {
        createConnection().then(() => console.log("DB Connect to database "+process.env.TYPEORM_DATABASE))
    }

    private routes(): void {
        this.express.use(new Routes().getRouter())

        const swaggerFilePath = this.isTest? '../../build/' : '../../'
        const swaggerFile = require(swaggerFilePath+'swaggerOutput.json')

        this.express.use('/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerFile))
    }

    public getExpress(){
        return this.express
    }
}
