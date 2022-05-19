import request from 'supertest'
import Utils from "../Utils";

describe('Communication Create', () => {
    beforeAll(async () => {
        await Utils.connectDatabase()
    })

    afterAll(async () => {
        await Utils.closeConnection()
    });

    beforeEach(async () => {
        await Utils.clearDatabase()
    })

    it('should return 200 because data is ok', async () => {
        const data = {
            date: '12/31/2023 23:59:59',
            recipient: 'João Paulo josé',
            message: 'Mensagem para João Paulo josé',
            format: 'push',
        }
        const response = await request(Utils.getApp()).post('/communication').send(data)
        expect(response.status).toBe(200)
    })
    it('should return 400 because invalid date', async () => {
        let data = {
            date: 'não é uma data',
            recipient: 'João Paulo josé',
            message: 'Mensagem para João Paulo josé',
            format: 'push',
        }
        const response = await request(Utils.getApp()).post('/communication').send(data)
        expect(response.status).toEqual(400)
    })
    it('should return 400 because date is before today', async () => {
        let data = {
            date: '12/31/2021 23:59:59',
            recipient: 'João Paulo josé',
            message: 'Mensagem para João Paulo josé',
            format: 'push',
        }
        const response = await request(Utils.getApp()).post('/communication').send(data)
        expect(response.status).toEqual(400)
    })
    it('should return 400 because invalid format', async () => {
        let data = {
            date: '12/31/2023 23:59:59',
            recipient: 'João Paulo josé',
            message: 'Mensagem para João Paulo josé',
            format: 'invalid format',
        }
        const response = await request(Utils.getApp()).post('/communication').send(data)
        expect(response.status).toEqual(400)
    })
    it('should return 200 because find a communication', async () => {
        const data = {
            date: '12/31/2023 23:59:59',
            recipient: 'João Paulo josé',
            message: 'Mensagem para João Paulo josé',
            format: 'whatsapp',
        }
        let response = await request(Utils.getApp()).post('/communication').send(data)

        response = await request(Utils.getApp()).get('/communication/'+response.body.id)
        expect(response.status).toBe(200)
    })
    it('should return 404 because not find a communication', async () => {
        const response = await request(Utils.getApp()).get('/communication/999')
        expect(response.status).toBe(404)
    })
    it('should return 200 because find a communication and status is scheduled', async () => {
        const data = {
            date: '12/31/2023 23:59:59',
            recipient: 'João Paulo josé',
            message: 'Mensagem para João Paulo josé',
            format: 'whatsapp',
        }
        let response = await request(Utils.getApp()).post('/communication').send(data)
        response = await request(Utils.getApp()).put('/communication/'+response.body.id)

        expect(response.status).toBe(200)
    })
    it('should return 404 because not find a communication', async () => {
        const response = await request(Utils.getApp()).put('/communication/999')
        expect(response.status).toBe(404)
    })
    it('should return 400 because find communication but status is canceled', async () => {
        const data = {
            date: '12/31/2023 23:59:59',
            recipient: 'João Paulo josé',
            message: 'Mensagem para João Paulo josé',
            format: 'whatsapp',
        }
        let response = await request(Utils.getApp()).post('/communication').send(data)
        response = await request(Utils.getApp()).put('/communication/'+response.body.id)

        response = await request(Utils.getApp()).put('/communication/'+response.body.id)

        expect(response.status).toBe(400)
    })
})