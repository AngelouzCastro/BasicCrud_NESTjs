import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Profile } from './profile.entity';
import { Post } from '../posts/post.entity';

//Definiendo el nombre de la tabla o entidad
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    username: string

    @Column()
    password: string

    @Column({unique: true})
    email: string

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date

    @Column({nullable: true})
    authStrategy: string

    //relacion uno a uno con la tabla profile
    //usuario tiene la llave foranea
    @OneToOne(() => Profile)
    @JoinColumn()
    profile: Profile

    //nota: no es lo mismo OneToMany a ManyToOne
    @OneToMany(() => Post, post => post.author)
    posts: Post[]
}