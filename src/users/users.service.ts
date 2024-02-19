import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
//dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createProfileDto } from './dto/create-profile.dto';
import { LoginUserDto } from './dto/login-user.dto';
//entittys
import { User } from './user.entity';
import { Profile } from './profile.entity';
//utils
import { hash, compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    //para interactuar con las entidades
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        private jwtService: JwtService
        ) {}

    // se requiere el await po que tiene que hacer una consulta a la base de datos y toma tiempo
    async createUser(user: CreateUserDto) {
        const { password } = user
        const plainToHash = await hash(password, 10)
        
        user = {...user, password:plainToHash}
        

        const userFound = await this.userRepository.findOne({
            where: {
                username: user.username
            }
        })

        const emailFound = await this.userRepository.findOne({
            where: {
                email: user.email
            }
        })
        
        if (userFound) {
            return new HttpException('El usuario ya existe', HttpStatus.CONFLICT)
        }
        if (emailFound) {
            return new HttpException('Este correo ya esta en uso', HttpStatus.CONFLICT)
        }

        const newUser = this.userRepository.create(user)
        this.userRepository.save(newUser)
        return new HttpException('Usuario creado', HttpStatus.ACCEPTED)
    }

    //get all users
    getUsers() {
        return this.userRepository.find({
            relations: ['posts', 'profile']
        })
    }

    //get one user by column called id
    async getUser(id: number) {
        const userFound = await this.userRepository.findOne({
            where: {    
                id,
            },
            relations: ['posts']
        })

        if(!userFound) {
            return new HttpException('Usuario no encntrado', HttpStatus.NOT_FOUND)
        }

        return userFound
    }

    async deleteUser(id: number) {
        const result = await this.userRepository.delete({ id })

        //se ejecuta si el usuario no es encontrado
        if(result.affected === 0) {
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        return result
    }

    async updateUser(id: number, user: UpdateUserDto) {
        const userFound = await this.userRepository.findOne({
            where: { 
                id 
            }
        })

        if (!userFound) {
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
        /** assign remplaza el parametro de un objeto por el otro nuevo comparado
         * los parametros de userFoun son remplazados por los parametros de User, 
         * donde coincide el nombre de los mismos parametros
        */
        const updateUser = Object.assign(userFound, user)
        return this.userRepository.save(updateUser)
    }


    async createProfile(id: number, profile: createProfileDto) {
        /*
        *1.-cuando creamos un perfil primero buscamos el usuario al que se le quiere crear el peril
        */
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        })

        //2-si  no existe regresamos error ya que no hay usuario a quien crearle el perfil
        if (!userFound) {
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }

        //3.-si existe procedemos a crear un dato dentro de la identidad de perfil
        // guardamos esta dato en la variable newProfile
        const newProfile = this.profileRepository.create(profile)

        //4.-guardamos el perfil
        // y devuelve un dato con el id del perfil que ya guardó
        const savedProfile = await this.profileRepository.save(newProfile)

        /*5.- del usuario que ya habiamos encontrado en el paso uno, en su propiedad profile
            guarda el obejto que acabamos de creear (savedProfiled)
            *aqui se creo la relación*
        */
        userFound.profile = savedProfile

        //6.-guardamos los datos dentro de user
        return this.userRepository.save(userFound)

    }

    async login(user: LoginUserDto) {
        const userFound = await this.userRepository.findOne({
            where: {
                email: user.email
            }
        })

        if (!userFound) {
            return new HttpException('Email no encontrado', HttpStatus.NOT_FOUND)
        }

        const checkPassword = await compare(user.password, userFound.password)

        if(!checkPassword) {
            return new HttpException('Contraseña incorrecta', 403)
        }

        //Firmar el token con informacion que no sea sensible
        const payload = {id: userFound.id, username: userFound.username}
        const token = this.jwtService.sign(payload)

        const data = {
            // user: userFound,
            message: "success",
            email: userFound.email,
            token
        }

        return data
    }
}
