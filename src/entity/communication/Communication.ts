import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate} from "typeorm";
import {validateOrReject} from "class-validator";

/**
 * Os possíveis estados do envio de comunicação:
 * agendado, enviado, cancelado
 */
export enum CommunicationStatusEnum {
    SCHEDULED = "Agendado",
    SENT = "Enviado",
    CANCELED = "Cancelado",
}

/**
 * Os possíveis formatos de comunicação que podem ser enviados são:
 * email, sms, push e whatsapp
 */
export enum CommunicationFormatEnum {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    WHATSAPP = "whatsapp",
}

/**
 * Tabela onde sera salvo os dados da comunicação no banco
 */
@Entity("communication")
export default class Communication extends BaseEntity {
    constructor() {
        super();
        this.status = CommunicationStatusEnum.SCHEDULED
    }

    @PrimaryGeneratedColumn({name: "id_communication",
        comment: "Chave primária da comunicação"
    })
    id: number;

    @Column({name: "date", type: "datetime", nullable: false, update: true,
        comment: "Data/Hora para o envio"
    })
    date: Date;

    @Column({name: "recipient", type: "varchar", length: "255", nullable: false, update: false})
    recipient: string;

    @Column({name: "message", type: "text", nullable: false, update: true})
    message: string;

    @Column({name: "format", type: "enum", enum: CommunicationFormatEnum, nullable: false, update: true,
        comment: "Mensagem a ser entregue"
    })
    format: CommunicationFormatEnum;

    @Column({name: "status", type: "enum", enum: CommunicationStatusEnum, nullable: false, update: true,
        comment: "Estado do envio"
    })
    status: CommunicationStatusEnum;

    public cancelSchedule(): void{
        Communication.validateIfIsScheduled(this.status)

        this.status = CommunicationStatusEnum.CANCELED
    }

    @BeforeInsert()
    @BeforeUpdate()
    private validate(): Promise<void> {
        Communication.validateDate(this.date)
        return validateOrReject(this)
    }

    public static validateDate(date?: Date): void{
        if(!date || date < new Date()) {
            throw Error("Invalid date")
        }
    }

    public static validateIfIsScheduled(status: CommunicationStatusEnum): void{
        if(status !== CommunicationStatusEnum.SCHEDULED){
            throw new Error("Communication can't be canceled, because status is not a scheduled");
        }
    }
}