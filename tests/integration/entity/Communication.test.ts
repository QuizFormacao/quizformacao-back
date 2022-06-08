import Communication, {
    CommunicationFormatEnum,
    CommunicationStatusEnum,
} from '../../../src/entity/communication/Communication';
import Utils from '../Utils';

describe('Communication', () => {
    it('should create a entity', async () => {
        let error = false;
        try {
            const communication = new Communication();
            communication.date = new Date('12/31/2023 23:59:59');
            communication.recipient = 'João da silva';
            communication.message = 'Oi João receba esse teste';
            communication.format = CommunicationFormatEnum.EMAIL;
            await (await Utils.getConnection()).getRepository(Communication).save(communication);
        } catch (e: any) {
            console.log(e.message);
            error = true;
        }

        expect(error).toBeFalsy();
    });
    it('should not create a entity because invalid date', async () => {
        let error = false;
        try {
            const communication = new Communication();
            communication.recipient = 'João da silva';
            communication.message = 'Oi João receba esse teste';
            communication.format = CommunicationFormatEnum.EMAIL;
            communication.date = new Date('não é uma data');
            await (await Utils.getConnection()).getRepository(Communication).save(communication);
        } catch (e: any) {
            error = true;
        }
        expect(error).toBeTruthy();
    });
    it('should find a entity', async () => {
        let error = false;

        try {
            let communication: Communication|undefined = new Communication();
            communication.date = new Date('12/31/2023 23:59:59');
            communication.recipient = 'João da silva';
            communication.message = 'Oi João receba esse teste';
            communication.format = CommunicationFormatEnum.EMAIL;

            const repository = (await Utils.getConnection()).getRepository(Communication);

            await repository.save(communication);
            await communication.reload();
            await repository.save(communication);

            communication = await repository.findOne(communication.id);
            if (!communication) error = true;
        } catch (e: any) {
            console.log(e.message);
            error = true;
        }

        expect(error).toBeFalsy();
    });
    it('not should find a entity', async () => {
        let error = false;
        try {
            const repository = (await Utils.getConnection()).getRepository(Communication);
            const communication = await repository.findOne(999);
            if (!communication) error = true;
        } catch (e: any) {
            console.log(e.message);
            error = true;
        }

        expect(error).toBeTruthy();
    });
    it('should to cancel the communication scheduled', async () => {
        let error = false;
        try {
            const communication = new Communication();
            communication.date = new Date('12/31/2023 23:59:59');
            communication.recipient = 'João da silva';
            communication.message = 'Oi João receba esse teste';
            communication.format = CommunicationFormatEnum.EMAIL;

            const repository = (await Utils.getConnection()).getRepository(Communication);
            await repository.save(communication);

            communication.cancelSchedule();
        } catch (e: any) {
            console.log(e.message);
            error = true;
        }
        expect(error).toBeFalsy();
    });
    it('not should to cancel the communication scheduled because status is canceled', async () => {
        let error = false;
        try {
            const communication = new Communication();
            communication.date = new Date('12/31/2023 23:59:59');
            communication.recipient = 'João da silva';
            communication.message = 'Oi João receba esse teste';
            communication.format = CommunicationFormatEnum.EMAIL;
            communication.status = CommunicationStatusEnum.CANCELED;

            const repository = (await Utils.getConnection()).getRepository(Communication);
            await repository.save(communication);

            communication.cancelSchedule();
        } catch (e: any) {
            error = true;
        }
        expect(error).toBeTruthy();
    });
    it('not should to cancel the communication scheduled because status is sent', async () => {
        let error = false;
        try {
            const communication = new Communication();
            communication.date = new Date('12/31/2023 23:59:59');
            communication.recipient = 'João da silva';
            communication.message = 'Oi João receba esse teste';
            communication.format = CommunicationFormatEnum.EMAIL;
            communication.status = CommunicationStatusEnum.SENT;

            const repository = (await Utils.getConnection()).getRepository(Communication);
            await repository.save(communication);

            communication.cancelSchedule();
        } catch (e: any) {
            error = true;
        }
        expect(error).toBeTruthy();
    });
});
