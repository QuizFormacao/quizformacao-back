import {NextFunction, Request, Response, Router} from "express";
import {HttpStatus} from "../../helpers/HttpStatus";
import Communication from "../../entity/communication/Communication";

export default class CommunicationController {
    private readonly router: Router

    constructor() {
        this.router = Router()

        this.createPostRouter()
        this.createGetOneRouter()
        this.createCancelRouter()
    }

    public getRouter(): Router{
        return this.router
    }

    private createPostRouter(): void{
        this.router.post('/', async (req: Request, res: Response, next: Function) => {
            /*
                #swagger.tags = ['Communication']
                #swagger.description = 'Endpoint para adicionar um agendamento de envio de comunicação'
                #swagger.parameters['Communication'] = {
                   in: 'body',
                   required: 'true',
                   description: 'Data e Hora para o envio(MM/dd/YYYY hh:mm:ss), \nDestinatário, \nMensagem a ser entregue, \nformatos: email, sms, push e whatsapp',
                   type: 'object',
                    schema: {date: '12/31/2022 23:59:59', recipient: 'João Paulo josé', message: 'Mensagem qualquer', format: 'email'}
               }
            */
            let {date, recipient, message, format} = req.body

            try {
                let communication = new Communication()
                communication.date = new Date(date)
                communication.recipient = recipient
                communication.message = message
                communication.format = format

                await communication.save()

                return res.status(HttpStatus.OK).json(communication)
            }catch (error: any){
                return res.status(HttpStatus.BAD_REQUEST).json({message: error.message})
            }
        })
    }

    private createGetOneRouter() : void {
        this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            /*
               #swagger.tags = ['Communication']
               #swagger.description = 'Endpoint para consultar o status de um agendamento pelo id'
            */
            try {
                const communication = await Communication.findOne(req.params.id)

                if(!communication){
                    return res.status(HttpStatus.NOT_FOUND).json({message: 'Communication Not Found'})
                }

                return res.status(HttpStatus.OK).json(communication)
            }catch (e: any){
                console.log(e.message)
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: 'DB Not available'})
            }
        })
    }

    private createCancelRouter(): void{
        this.router.put('/:id', async (req: Request, res: Response, next: Function) => {
            /*
                #swagger.tags = ['Communication']
                #swagger.description = 'Endpoint para cancelar um agendamento pelo id'
            */
            const communication = await Communication.findOne(req.params.id)

            if(!communication){
                return res.status(HttpStatus.NOT_FOUND).json({message: 'Communication Not Found'})
            }

            try {
                communication.cancelSchedule()
                await communication.save()

                return res.status(HttpStatus.OK).json(communication)
            }catch (error: any) {
                return res.status(HttpStatus.BAD_REQUEST).json({message: error.message})
            }
        })
    }
}