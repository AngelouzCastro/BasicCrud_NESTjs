import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../users/user.entity"

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string

    //para identificar uno
    @Column()
    authorId: number

    // mostrar todo el contenido que le pertenece al author
    //desde post puedes acceder al usuario
    @ManyToOne(() => User, user => user.posts)
    author: User
}