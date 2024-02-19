import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";
/**
 * Nota en las peticiones los campos del Json deben de coincidir con
 * los establecidos en en esta entidad (establecer CamellCase o fijarse en la escritura)
 */
@Entity('user_profile')
export class Profile {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fistname: string

    @Column()
    lastname: string

    //este campo puede ser nulo
    @Column({nullable: true})
    age: number
}