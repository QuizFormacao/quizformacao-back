import {Router} from 'express'
import CommunicationController from "./communication/CommunicationController";

export default class Routes {
    private readonly router: Router

    constructor() {
        this.router = Router()

        this.router.use('/communication', new CommunicationController().getRouter())
    }

    public getRouter(): Router{
        return this.router
    }
}
