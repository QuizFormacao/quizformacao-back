import Communication, {CommunicationStatusEnum} from "../../src/entity/communication/Communication";

describe('Communication', () => {
    it('should Validate if a status is scheduled with SCHEDULED', () => {
        let error = false
        try {
            Communication.validateIfIsScheduled(CommunicationStatusEnum.SCHEDULED)
        }catch (e: any) {
            console.log(e.message)
            error = true
        }
        expect(error).toBeFalsy()
    })
    it('should Validate if a status is scheduled with CANCELED', () => {
        let error = false
        try {
            Communication.validateIfIsScheduled(CommunicationStatusEnum.CANCELED)
        }catch (e: any) {
            error = true
        }
        expect(error).toBeTruthy()
    })
    it('should Validate if a status is scheduled with SENT', () => {
        let error = false
        try {
            Communication.validateIfIsScheduled(CommunicationStatusEnum.SENT)
        }catch (e: any) {
            error = true
        }
        expect(error).toBeTruthy()
    })
})